import React, { useEffect, useState } from 'react';
import ForgeReconciler, {
  Badge,
  Button,
  Heading,
  Inline,
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
      if (!key) throw new Error('Open this panel from a Jira issue to investigate it.');
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

  if (loading) return <Stack space="space.200"><Spinner /><Text>Reading issue context from Jira…</Text></Stack>;
  if (error) return <Stack space="space.200"><SectionMessage appearance="error"><Text>{error}</Text></SectionMessage><Button onClick={loadIssue}>Retry</Button></Stack>;
  if (!incident) return <Text>No issue context is available.</Text>;

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
      <Stack space="space.100">
        <Heading size="medium">Evidence collected</Heading>
        <Text>• Jira issue fields</Text>
        <Text>Operational sources connected: {incident.connectedOperationalSources.length}</Text>
        <Text>Deployment, logs, metrics and tracing integrations are not connected yet.</Text>
      </Stack>
      <Button appearance="subtle" onClick={loadIssue}>Refresh Jira context</Button>
    </Stack>
  );
}

ForgeReconciler.render(<App />);
