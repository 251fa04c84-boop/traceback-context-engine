import React, { useEffect, useRef, useState } from 'react';
import ForgeReconciler, {
  Badge,
  Button,
  Heading,
  Inline,
  Link,
  SectionMessage,
  Spinner,
  Stack,
  Text,
  useProductContext
} from '@forge/react';
import { invoke } from '@forge/bridge';
import { getIssueKeyFromProductContext, getRetryIssueKey } from '../domain/incident';
import { buildInvestigationLeads } from '../domain/investigation';
import { buildIncidentTimeline } from '../domain/timeline';
import { getCategoryEmptyStateMessage } from '../domain/evidence-copy';

const EMPTY_GRAPH = {
  source: 'Atlassian Teamwork Graph',
  status: 'unavailable',
  goals: [],
  deployments: [],
  pullRequests: [],
  warning: 'Teamwork Graph evidence was not returned.'
};

function SourceLink({ url, label }) {
  if (!url) return <Text>{label} (source URL unavailable)</Text>;
  return <Link href={url} openNewTab>{label}</Link>;
}

function App() {
  const productContext = useProductContext();
  const contextReady = Boolean(productContext);
  const contextIssueKey = getIssueKeyFromProductContext(productContext);
  const [issueKey, setIssueKey] = useState('');
  const [incident, setIncident] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const requestSequence = useRef(0);

  async function loadIssue(key) {
    if (!key) return;
    const requestId = ++requestSequence.current;
    setIssueKey(key);
    setLoading(true);
    setError('');
    try {
      const result = await invoke('getIssueContext', { issueKey: key });
      if (requestId === requestSequence.current) setIncident(result);
    } catch (err) {
      if (requestId === requestSequence.current) {
        setError(err?.message || 'Unable to load Jira issue context.');
      }
    } finally {
      if (requestId === requestSequence.current) setLoading(false);
    }
  }

  useEffect(() => {
    if (!contextReady) return;
    if (!contextIssueKey) {
      setError('Open this panel from a Jira issue to investigate it.');
      setLoading(false);
      return;
    }
    loadIssue(contextIssueKey);
    return () => {
      requestSequence.current += 1;
    };
  }, [contextIssueKey, contextReady]);

  if (loading) return <Stack space="space.200"><Spinner /><Text>Reading issue and linked evidence from Jira…</Text></Stack>;
  if (error) return <Stack space="space.200"><SectionMessage appearance="error"><Text>{error}</Text></SectionMessage><Button onClick={() => loadIssue(getRetryIssueKey(productContext, issueKey))}>Retry</Button></Stack>;
  if (!incident) return <Text>No issue context is available.</Text>;

  const graph = incident.teamworkGraph || EMPTY_GRAPH;
  const evidenceCount = graph.goals.length + graph.deployments.length + graph.pullRequests.length;
  const investigationLeads = buildInvestigationLeads({
    issue: incident,
    relatedWorkItems: incident.relatedWorkItems,
    teamworkGraph: graph
  });
  const incidentTimeline = buildIncidentTimeline({
    issue: incident,
    teamworkGraph: graph
  });

  return (
    <Stack space="space.300">
      <Inline space="space.100" alignBlock="center" shouldWrap>
        <Badge appearance="discovery">Jira evidence</Badge>
        <Text>{issueKey}</Text>
      </Inline>
      <Heading size="medium">{incident.summary}</Heading>
      <Inline space="space.100" shouldWrap>
        <Badge appearance="default">{incident.status}</Badge>
        <Badge appearance="default">{incident.issueType}</Badge>
        <Badge appearance="default">Priority: {incident.priority}</Badge>
      </Inline>
      <Stack space="space.100">
        <Heading size="small">Issue description</Heading>
        <Text>{incident.description || 'No description was provided.'}</Text>
      </Stack>
      <SectionMessage appearance="information">
        <Stack space="space.100">
          <Heading size="small">Evidence boundary</Heading>
          <Text>{incident.assessment}</Text>
          <Text>Jira links and external delivery records are context only; a relationship does not prove cause.</Text>
        </Stack>
      </SectionMessage>

      <Stack space="space.100">
        <Heading size="medium">Suggested next checks ({investigationLeads.length})</Heading>
        <Text>Deterministic review scores rank what to inspect first; they are not causal probabilities or root-cause findings.</Text>
        {investigationLeads.length > 0 ? investigationLeads.map((lead) => (
          <Stack key={lead.id} space="space.050">
            <Inline space="space.100" shouldWrap alignBlock="center">
              <Text>{lead.title}</Text>
              <Badge appearance={lead.priority === 'high' ? 'danger' : lead.priority === 'medium' ? 'warning' : 'default'}>
                {lead.priority}
              </Badge>
              <Badge appearance="default">Review score: {lead.rankScore}/100</Badge>
            </Inline>
            <Text>{lead.sourceLabel} · Evidence type: {lead.evidenceKind}</Text>
            <Text>{lead.rationale}</Text>
            <Text>{lead.scoreMeaning}</Text>
            {lead.url ? <SourceLink url={lead.url} label="Open supporting source" /> : null}
          </Stack>
        )) : <Text>No specific follow-up checks could be derived from the records currently available.</Text>}
      </Stack>

      <Stack space="space.100">
        <Heading size="medium">Incident timeline ({incidentTimeline.length})</Heading>
        <Text>Chronological source-record timestamps. This is not a complete audit history; missing timestamps and unavailable sources are not filled in.</Text>
        {incidentTimeline.length > 0 ? incidentTimeline.map((event) => (
          <Stack key={event.id} space="space.050">
            <Inline space="space.100" shouldWrap alignBlock="center">
              <Text>{event.title}</Text>
              <Badge appearance="default">{event.sourceType}</Badge>
            </Inline>
            <Text>{event.occurredAt}</Text>
            <Text>{event.summary}</Text>
            <Text>{event.provenance}</Text>
            <SourceLink url={event.url} label={`Open ${event.sourceLabel}`} />
          </Stack>
        )) : <Text>No usable source timestamps were returned. The timeline will not invent dates.</Text>}
      </Stack>

      <Stack space="space.100">
        <Heading size="small">Related Jira work ({incident.relatedWorkItems?.length || 0})</Heading>
        <Text>Existing Jira issue links connected to this work item.</Text>
        {incident.relatedWorkItems?.length > 0 ? incident.relatedWorkItems.map((item) => (
          <Stack key={item.key} space="space.050">
            <Text>{item.summary}</Text>
            <Inline space="space.100" shouldWrap alignBlock="center">
              <Badge appearance="default">{item.key}</Badge>
              <Badge appearance="default">{item.status}</Badge>
            </Inline>
            <Text>{item.relationship} · {item.issueType} · Priority: {item.priority}</Text>
            <Link href={item.url}>Open related Jira issue</Link>
          </Stack>
        )) : <Text>No linked Jira work items were returned.</Text>}
      </Stack>

      <Stack space="space.200">
        <Inline alignBlock="center" space="space.100">
          <Heading size="medium">Teamwork Graph evidence</Heading>
          <Badge appearance={graph.status === 'available' ? 'success' : graph.status === 'partial' ? 'warning' : 'default'}>
            {graph.status}
          </Badge>
        </Inline>
        <Text>{graph.source || 'Atlassian Teamwork Graph'} · {evidenceCount} linked records</Text>
        <Text>The app follows Teamwork Graph cursors and attempts to load up to 125 records per category. If pagination cannot complete within that safety limit, the warning below identifies where more records may exist.</Text>
        {graph.warning ? <Text>{graph.warning}</Text> : graph.status === 'empty'
          ? <Text>The Teamwork Graph query returned no linked records visible to this user. This does not prove that no related evidence exists elsewhere.</Text>
          : graph.status === 'unavailable'
            ? <Text>Teamwork Graph evidence is currently unavailable. Check app scopes, site configuration, and current-user access.</Text>
            : <Text>Linked records were returned for this Jira work item.</Text>}
      </Stack>

      <Stack space="space.100">
        <Heading size="small">Linked Atlassian goals ({graph.goals.length})</Heading>
        {graph.goals.length > 0 ? graph.goals.map((goal) => (
          <Stack key={goal.id} space="space.050">
            <Text>{goal.key ? `${goal.key} — ${goal.name}` : goal.name}</Text>
            <SourceLink url={goal.url} label="Open goal" />
            {goal.archived ? <Badge appearance="default">Archived</Badge> : null}
          </Stack>
        )) : <Text>{getCategoryEmptyStateMessage(graph.status, 'Goal')}</Text>}
      </Stack>

      <Stack space="space.100">
        <Heading size="small">Linked deployments ({graph.deployments.length})</Heading>
        {graph.deployments.length > 0 ? graph.deployments.map((deployment) => (
          <Stack key={deployment.id} space="space.050">
            <Inline space="space.100" shouldWrap alignBlock="center">
              <Text>{deployment.title}</Text>
              <Badge appearance={deployment.state === 'FAILED' ? 'danger' : deployment.state === 'SUCCESSFUL' ? 'success' : 'default'}>
                {deployment.state}
              </Badge>
            </Inline>
            <Text>{deployment.environment} · {deployment.provider}{deployment.region ? ` · ${deployment.region}` : ''}</Text>
            {deployment.createdAt ? <Text>Created: {deployment.createdAt}</Text> : null}
            <SourceLink url={deployment.url} label="Open deployment" />
          </Stack>
        )) : <Text>{getCategoryEmptyStateMessage(graph.status, 'Deployment')}</Text>}
      </Stack>

      <Stack space="space.100">
        <Heading size="small">Related pull requests ({graph.pullRequests.length})</Heading>
        {graph.pullRequests.length > 0 ? graph.pullRequests.map((pullRequest) => (
          <Stack key={pullRequest.id} space="space.050">
            <Inline space="space.100" shouldWrap alignBlock="center">
              <Text>{pullRequest.displayId ? `#${pullRequest.displayId} — ${pullRequest.title}` : pullRequest.title}</Text>
              <Badge appearance={pullRequest.status === 'MERGED' ? 'success' : pullRequest.status === 'DECLINED' ? 'danger' : 'default'}>
                {pullRequest.status}
              </Badge>
            </Inline>
            <Text>{pullRequest.provider}{pullRequest.createdAt ? ` · ${pullRequest.createdAt}` : ''}</Text>
            <SourceLink url={pullRequest.url} label="Open pull request" />
          </Stack>
        )) : <Text>{getCategoryEmptyStateMessage(graph.status, 'Pull request')}</Text>}
      </Stack>

      <Button appearance="subtle" onClick={() => loadIssue(issueKey)}>Refresh issue and evidence</Button>
    </Stack>
  );
}

ForgeReconciler.render(<App />);
