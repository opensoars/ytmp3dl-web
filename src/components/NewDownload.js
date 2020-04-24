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

export default function NewDownlod() {
  const inputRef = useRef();

  const [startDownload, { data }] = useMutation(START_DOWNLOAD);

  function handleNewDownloadClick() {
    startDownload({ variables: { v: inputRef.current.value } });
  }

  return (
    <>
      <TextField
        style={{ marginTop: 4 }}
        color="secondary"
        label="New download"
        inputRef={inputRef}
      />
      <Button
        onClick={handleNewDownloadClick}
        style={{ marginLeft: 8, marginTop: 16 }}
        variant="contained"
      >
        Start DL
      </Button>
    </>
  );
}
