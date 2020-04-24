import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import {
  Paper,
  Box,
  Container,
  Typography,
  Button,
  LinearProgress,
  withStyles,
  lighten,
  useTheme,
  useMediaQuery,
  Fade,
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
  FormGroup
} from '@material-ui/core';

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
      output_location
      file_name
    }
  }
`;

const RETRY_DOWNLOAD = gql`
  mutation retryDownload($v: String!) {
    retryDownload(v: $v) {
      v
    }
  }
`;

const DELETE_DOWNLOAD = gql`
  mutation deleteDownload($v: String!) {
    deleteDownload(v: $v) {
      v
    }
  }
`;

const BorderLinearProgress = withStyles({
  root: {
    height: 10
    //   backgroundColor: lighten('#ff6c5c', 0.5)
  },
  bar: {
    //   backgroundColor: '#ff6c5c'
  }
})(LinearProgress);

function Download({ dl }) {
  const theme = useTheme();
  const [retryDownload, { retryData }] = useMutation(RETRY_DOWNLOAD);
  const [deleteDownload, { deleteData }] = useMutation(DELETE_DOWNLOAD);

  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  function handleRetryClick() {
    retryDownload({ variables: { v: dl.v } });
  }
  function handleDeleteClick() {
    deleteDownload({ variables: { v: dl.v } });
  }
  // console.log('theme.palette', theme.palette);

  return (
    // <Fade in>
    <Fade in timeout={500}>
      <Paper
        elevation={5}
        style={{
          marginTop: theme.spacing(1),
          overflow: 'auto',
          transition: 'all 0.5s ease',
          background: dl.completed
            ? theme.palette.success.light
            : dl.error
            ? theme.palette.warning.light
            : theme.palette.background.paper
        }}
      >
        <Box p={1}>
          <Button
            color="primary"
            variant="contained"
            onClick={handleDeleteClick}
            style={{ float: 'right' }}
          >
            X
          </Button>

          <Button
            color="secondary"
            variant="contained"
            onClick={handleRetryClick}
            style={{ float: 'right', marginRight: theme.spacing(1) }}
          >
            Retry
          </Button>

          <Typography variant="body1">
            Title: {dl.video_info ? dl.video_info.title : '?'}
          </Typography>
          <Typography variant="body1"></Typography>
          <Typography variant="body1">
            <a
              target="_blank"
              href={`https://youtube.com/watch?v=${dl.v}`}
            >{`youtube.com/watch?v=`}</a>
            {dl.v} | Length seconds:{' '}
            {dl.video_info ? dl.video_info.length_seconds : null}
          </Typography>
          <Typography variant="body1">
            Completed: <b>{dl.completed ? 'true' : 'false'}</b> | Error:{' '}
            <b>{dl.error ? 'true' : 'false'}</b> | Start:{' '}
            {/* {dl.start ? new Date(parseInt(dl.start)).toLocaleString() : null} */}
            {dl.start
              ? new Date(parseInt(dl.start)).toString().replace(/\sGMT.+/, '')
              : null}
          </Typography>
          <Typography variant="body1"></Typography>
          <div
            style={{
              display: 'flex',
              flexDirection: isDesktop ? 'row' : 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>Stream progress</div>
            <BorderLinearProgress
              variant="determinate"
              color="secondary"
              style={{
                marginLeft: isDesktop ? theme.spacing(1) : 0,
                marginTop: isDesktop ? 6 : 0,
                heigh: 10,
                flexGrow: 1
              }}
              value={dl.streamProgress ? dl.streamProgress.percentage : 0}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: isDesktop ? 'row' : 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>Conversion progress</div>
            <BorderLinearProgress
              variant="determinate"
              color="secondary"
              style={{
                marginLeft: isDesktop ? theme.spacing(1) : 0,
                marginTop: isDesktop ? 6 : 0,
                heigh: 10,
                flexGrow: 1
              }}
              value={
                dl.conversionProgress ? dl.conversionProgress.percentage : 0
              }
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: isDesktop ? 'row' : 'column',
              justifyContent: 'space-between',
              width: isDesktop ? '100%' : '100%'
            }}
          >
            <Paper
              elevation={5}
              style={{
                overflow: 'auto',
                height: 150,
                minWidth: isDesktop ? 333 : 0,
                maxWidth: isDesktop ? 333 : 'unset',
                width: isDesktop ? 333 : '100%',
                width: 'auto',
                padding: theme.spacing(1),
                margin: '16px 0px'
              }}
            >
              <pre style={{ margin: 0 }}>
                {[...dl.methodsCalled]
                  .reverse()
                  .map(
                    (method, i) =>
                      `${dl.methodsCalled.length - i - 1}: ${method}\n`
                  )}
              </pre>
            </Paper>

            {dl.errs && dl.errs.length ? (
              <Paper
                style={{
                  overflow: 'auto',
                  flexGrow: 1,
                  marginLeft: isDesktop ? theme.spacing(1) : 0,
                  height: 166,
                  marginTop: isDesktop ? 16 : 0,
                  marginBottom: theme.spacing(1)
                  // width: '100%',
                  // minWidth: '100%'
                }}
              >
                <pre
                  // style={{
                  //   overflow: 'auto',
                  //   flexGrow: 1,
                  //   marginLeft: theme.spacing(1)
                  // }}
                  style={{ margin: 0, padding: theme.spacing(1) }}
                >
                  {dl.errs.map((err, i) => err + '\n\n')}
                </pre>
              </Paper>
            ) : null}
          </div>

          <pre style={{ width: '100%', overflow: 'hidden', margin: 0 }}>
            DL:{'   '}
            <a target="_blank" href={dl.working_url}>
              {dl.working_url}
            </a>
          </pre>
          <pre style={{ width: '100%', overflow: 'hidden', margin: 0 }}>
            OUT:{'  '}
            <a href={'file:///' + dl.output_location}>{dl.output_location}</a>
          </pre>
          {/* <pre style={{ width: '100%', overflow: 'hidden', margin: 0 }}>
          FILE:{' '}
          <a target="_blank" href={'http://localhost:3333/' + dl.file_name}>
            {dl.file_name}
          </a>
        </pre> */}
          <audio
            style={{ marginTop: theme.spacing(1) }}
            src={'http://localhost:3333/' + dl.file_name}
            controls
          />
        </Box>
      </Paper>
    </Fade>
  );
}

export default function Downloads() {
  const { loading, error, data, refetch } = useQuery(DOWNLOADS);
  // console.log();

  const [showProgress, setShowProgress] = useState(true);
  const [showDone, setShowDone] = useState(true);
  const [showError, setShowError] = useState(true);

  useEffect(() => {
    const refetchInterval = setInterval(() => {
      refetch();
    }, 500);

    return () => {
      clearInterval(refetchInterval);
    };
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  function handleFilterChange(evt) {
    console.log(evt.target.value);
    if (evt.target.value === 'progress') setShowProgress(evt.target.checked);
    else if (evt.target.value === 'done') setShowDone(evt.target.checked);
    else if (evt.target.value === 'error') setShowError(evt.target.checked);
  }

  return (
    <>
      <FormControl component="fieldset">
        <FormGroup aria-label="position" row onChange={handleFilterChange}>
          <FormControlLabel
            value="progress"
            control={<Checkbox color="secondary" />}
            label="Progress"
            labelPlacement="left"
            checked={showProgress}
          />
          <FormControlLabel
            value="done"
            control={<Checkbox color="secondary" />}
            label="Done"
            labelPlacement="left"
            checked={showDone}
          />
          <FormControlLabel
            value="error"
            control={<Checkbox color="secondary" />}
            label="Error"
            labelPlacement="left"
            checked={showError}
          />
        </FormGroup>
      </FormControl>

      {data.downloads
        .reverse()
        .filter(dl => {
          console.log('dl', dl);

          if (!showProgress && !dl.completed && !dl.err) return false;
          if (!showDone && dl.completed) return false;
          if (!showError && dl.err) return false;

          return true;
        })
        .map((dl, i) => (
          <Fade in key={i} timeout={500}>
            <Download dl={dl} />
          </Fade>
        ))}
    </>
  );
  // return data.rates.map(({ currency, rate }) => (
  //   <div key={currency}>
  //     <p>
  //       {currency}: {rate}
  //     </p>
  //   </div>
  // ));
}
