import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Paper, Box, Container, Typography } from '@material-ui/core';

const DOWNLOADS = gql`
  {
    downloads {
      start
      v
      completed
      error
      errs
      methodsCalled
      video_info {
        title
        length_seconds
      }
      streamProgress {
        bytesWritten
        bytesTotal
        percentage
      }
      conversionProgress {
        current
        total
        percentage
      }
      working_url
      file_location
    }
  }
`;

function Download({ dl }) {
  return (
    <Paper elevation={5} style={{ marginTop: 8 }}>
      <Box p={1}>
        <div variant="body1">
          Video info:{' '}
          <pre style={{ width: '100%', overflow: 'auto' }}>
            Title: {dl.video_info ? dl.video_info.title : null}
            <br />
            Length seconds: {dl.video_info ? dl.video_info.title : null}
            <br />
          </pre>
        </div>
        <Typography variant="body1">V: {dl.v}</Typography>
        <Typography variant="body1">
          Start:{' '}
          {dl.start ? new Date(parseInt(dl.start)).toLocaleString() : null}
        </Typography>
        <Typography variant="body1">
          Completed: {dl.completed ? 'true' : 'false'}
        </Typography>
        <Typography variant="body1">
          Error: {dl.error ? 'true' : 'false'}
        </Typography>
        <div>
          Errs:{' '}
          <pre style={{ width: '100%', overflow: 'auto' }}>
            {dl.errs.map((err, i) => err)}
          </pre>
        </div>
        <div>
          Methods called:{' '}
          <pre style={{ width: '100%', overflow: 'auto', maxHeight: 250 }}>
            {dl.methodsCalled.map((method, i) => `${i}: ${method}\n`)}
          </pre>
        </div>
        <div variant="body1">
          Working url:{' '}
          <pre style={{ width: '100%', overflow: 'auto' }}>
            <a href={dl.working_url}>{dl.working_url}</a>
          </pre>
        </div>
        <div variant="body1">
          File location:{' '}
          <pre style={{ width: '100%', overflow: 'auto' }}>
            <a href={'file:///' + dl.file_location}>{dl.file_location}</a>
          </pre>
        </div>
        <div>
          Stream progress:{' '}
          <pre style={{ width: '100%', overflow: 'auto' }}>
            bytesWritten:{' '}
            {dl.streamProgress ? dl.streamProgress.bytesWritten : null}
            <br />
            bytesTotal:{' '}
            {dl.streamProgress ? dl.streamProgress.bytesTotal : null}
            <br />
            percentage:{' '}
            {dl.streamProgress ? dl.streamProgress.percentage : null}
          </pre>
        </div>
        <div>
          Conversion progress progress:{' '}
          <pre style={{ width: '100%', overflow: 'auto' }}>
            current:{' '}
            {dl.conversionProgress ? dl.conversionProgress.current : null}
            <br />
            total: {dl.conversionProgress ? dl.conversionProgress.total : null}
            <br />
            percentage:{' '}
            {dl.conversionProgress ? dl.conversionProgress.percentage : null}
          </pre>
        </div>
      </Box>
    </Paper>
  );
}

export default function Downloads() {
  const { loading, error, data, refetch } = useQuery(DOWNLOADS);
  console.log();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Container>
      {data.downloads.map((dl, i) => (
        <Download key={i} dl={dl} />
      ))}
    </Container>
  );
  // return data.rates.map(({ currency, rate }) => (
  //   <div key={currency}>
  //     <p>
  //       {currency}: {rate}
  //     </p>
  //   </div>
  // ));
}
