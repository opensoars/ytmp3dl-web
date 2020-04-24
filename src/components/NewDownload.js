import React, { useRef } from 'react';
import { TextField, Paper, Box, Button } from '@material-ui/core';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const START_DOWNLOAD = gql`
  mutation startDownload($v: String!) {
    startDownload(v: $v) {
      v
    }
  }
`;

function getVideoId(str) {
  var video_id = '';
  if (str.length === 11) return str;
  try {
    str = str.replace(/\#/, '');
    var q = str.split('/watch?')[1],
      qs = q.split('&');
    for (var i = 0; i < qs.length; i += 1) {
      var single_q = qs[i];
      if (single_q.indexOf('v=') !== -1 && single_q.charAt(0) === 'v') {
        video_id = single_q.split('v=')[1];
      }
    }
  } catch (e) {
    video_id = '';
  }
  return video_id.length === 11 ? video_id : '';
}

export default function NewDownlod() {
  const inputRef = useRef();

  const [startDownload, { data }] = useMutation(START_DOWNLOAD);

  function handleNewDownloadClick() {
    const v = getVideoId(inputRef.current.value);

    if (v.length === 11) {
      startDownload({ variables: { v: v } });
    }
  }

  return (
    <>
      <TextField
        style={{ marginTop: 8 }}
        color="secondary"
        label="New download"
        inputRef={inputRef}
        style={{ flexGrow: 1, marginTop: 6 }}
      />
      <Button
        onClick={handleNewDownloadClick}
        style={{ marginLeft: 8, marginTop: 16, marginBottom: 8 }}
        variant="contained"
      >
        Start DL
      </Button>
    </>
  );
}
