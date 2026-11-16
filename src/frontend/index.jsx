import React, { useEffect, useState } from 'react';
import ForgeReconciler, {
  Badge,
  Button,
  Heading,
  Inline,
  Link,
  SectionMessage,
  Spinner,
  Stack,
  Text
} from '@forge/react';
import { invoke, view } from '@forge/bridge';

function App() {
  const [issueKey, setIssueKey] = useState('');
  const [incident, setIncident] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadIssue() {
    setLoading(true);
    setError('');
    try {
      const context = await view.getContext();
      const key = context?.extension?.issue?.key || context?.platformContext?.issueKey;
      if (!key) throw new Error('Open this context panel from a Jira issue to investigate it.');
      setIssueKey(key);
      const result = await invoke('getIssueContext', { issueKey: key });
      setIncident(result);
    } catch (err) {
      setError(err?.message || 'Unable to load Jira issue context.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadIssue(); }, []);

  if (loading) {
    return <Stack space="space.200"><Spinner /><Text>Reading Jira and connected evidence…</Text></Stack>;
  }
  if (error) {
    return <Stack space="space.200"><SectionMessage appearance="error"><Text>{error}</Text></SectionMessage><Button onClick={loadIssue}>Retry</Button></Stack>;
  }
  if (!incident) return <Text>No issue context is available.</Text>;

  const graph = incident.teamworkGraph || {};
  const goals = Array.isArray(graph.goals) ? graph.goals : [];
  const deployments = Array.isArray(graph.deployments) ? graph.deployments : [];
  const pullRequests = Array.isArray(graph.pullRequests) ? graph.pullRequests : [];
  const graphStatus = graph.status || 'unavailable';
  const graphWarning = graph.warning || 'Teamwork Graph evidence is not available for this issue.';

  return (
    <Stack space="space.300">
      <Inline space="space.100" alignBlock="center">
        <Badge appearance="discovery">Jira evidence</Badge>
        <Text>{issueKey}</Text>
      </Inline>
      <Heading size="large">{incident.summary}</Heading>
      <Inline space="space.100" shouldWrap>
        <Badge appearance="default">{incident.status}</Badge>
        <Badge appearance="default">{incident.issueType}</Badge>
        <Badge appearance="default">Priority: {incident.priority}</Badge>
      </Inline>

      <Stack space="space.100">
        <Heading size="medium">Issue description</Heading>
        <Text>{incident.description || 'No description was provided.'}</Text>
      </Stack>

      <SectionMessage appearance="information">
        <Stack space="space.100">
          <Heading size="small">Evidence boundary</Heading>
          <Text>{incident.assessment}</Text>
        </Stack>
      </SectionMessage>

      <Stack space="space.200">
        <Heading size="medium">Connected evidence</Heading>
        <Inline space="space.100" shouldWrap>
          <Badge appearance="discovery">Atlassian Teamwork Graph</Badge>
          <Badge appearance="default">{graphStatus}</Badge>
        </Inline>
        <Text>
          {goals.length} linked goals · {deployments.length} deployments · {pullRequests.length} pull requests
        </Text>
        {graphWarning ? (
          <SectionMessage appearance="information"><Text>{graphWarning}</Text></SectionMessage>
        ) : null}

        <Stack space="space.100">
          <Heading size="small">Deployments</Heading>
          {deployments.length === 0 ? (
            <Text>No linked deployment records were returned.</Text>
          ) : deployments.map((item, index) => (
            <Stack key={item.id || `deployment-${index}`} space="space.050">
              <Inline space="space.100" alignBlock="center" shouldWrap>
                <Text>{item.title}</Text>
                <Badge appearance="default">{item.state}</Badge>
              </Inline>
              <Text>{[item.environment, item.provider, item.region].filter(Boolean).join(' · ')}</Text>
              {item.description ? <Text>{item.description}</Text> : null}
              {item.url ? <Text><Link href={item.url} openNewTab>Open deployment source</Link></Text> : <Text>No source URL was supplied.</Text>}
            </Stack>
          ))}
        </Stack>

        <Stack space="space.100">
          <Heading size="small">Pull requests</Heading>
          {pullRequests.length === 0 ? (
            <Text>No linked pull request records were returned.</Text>
          ) : pullRequests.map((item, index) => (
            <Stack key={item.id || `pull-request-${index}`} space="space.050">
              <Inline space="space.100" alignBlock="center" shouldWrap>
                <Text>{item.title}</Text>
                <Badge appearance="default">{item.status}</Badge>
              </Inline>
              <Text>{[item.displayId ? `#${item.displayId}` : '', item.provider].filter(Boolean).join(' · ')}</Text>
              {item.url ? <Text><Link href={item.url} openNewTab>Open pull request source</Link></Text> : <Text>No source URL was supplied.</Text>}
            </Stack>
          ))}
        </Stack>

        <Stack space="space.100">
          <Heading size="small">Goals</Heading>
          {goals.length === 0 ? (
            <Text>No linked goal records were returned.</Text>
          ) : goals.map((item, index) => (
            <Stack key={item.id || `goal-${index}`} space="space.050">
              <Text>{item.name}{item.key ? ` · ${item.key}` : ''}</Text>
              {item.description ? <Text>{item.description}</Text> : null}
              <Text>{item.archived === true ? 'Archived goal' : item.archived === false ? 'Active goal' : 'Goal status unavailable'}</Text>
              {item.url ? <Text><Link href={item.url} openNewTab>Open goal</Link></Text> : null}
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Stack space="space.100">
        <Heading size="medium">Evidence still missing</Heading>
        <Text>Live telemetry, service logs, traces, and alert history are not connected in this version. Linked changes are context, not proof of incident causation.</Text>
      </Stack>

      <Button appearance="subtle" onClick={loadIssue}>Refresh Jira and graph evidence</Button>
    </Stack>
  );
}

ForgeReconciler.render(<App />);
