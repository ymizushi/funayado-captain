import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";


export function useSlack() {
  const formData = new FormData();
  const inputFileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (!event.target.files?.length) {
      return;
    }
    Array.from(event.target.files).map((file) => {
      formData.append('file', file);
    });
  };
  const postSlack = async () => {
    formData.append(
      'message',
      'ここにメッセージを入れる'
    );
    await fetch('/api/slack', {
      method: 'POST',
      body: formData,
    });
  }
}