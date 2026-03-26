"use client";

import React, { useEffect, useId, useMemo } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import { useFileSystem } from "../context/FileSystemProvider";
import type { FileSystemAction, FSFileNode } from "../context/fileSystemTypes";
import {
  formLabel,
  multilineInput,
  primaryButton,
  secondaryButton,
} from "./fileSystemStyles";

type FormValues = { content: string };

function EditorInner({
  fileNode,
  dispatch,
}: {
  fileNode: FSFileNode;
  dispatch: React.Dispatch<FileSystemAction>;
}) {
  const titleId = useId();
  const formId = useId();
  const contentFieldId = `${formId}-content`;

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { content: fileNode.content },
    mode: "onChange",
  });

  useEffect(() => {
    reset({ content: fileNode.content });
  }, [fileNode.content, reset]);

  useEffect(() => {
    const t = window.setTimeout(() => setFocus("content"), 0);
    return () => window.clearTimeout(t);
  }, [setFocus]);

  const handleClose = () => dispatch({ type: "CLOSE_TEXT_EDITOR" });

  const onValid = (data: FormValues) => {
    dispatch({
      type: "SAVE_TEXT_FILE",
      nodeId: fileNode.id,
      content: data.content,
    });
  };

  return (
    <Modal
      open
      onClose={handleClose}
      panelClassName="max-w-3xl"
      aria-labelledby={titleId}
    >
      <Modal.Header>
        <h2
          id={titleId}
          className="min-w-0 flex-1 truncate pr-2 text-sm font-semibold"
        >
          {fileNode.name}
        </h2>
      </Modal.Header>
      <Modal.Body>
        <form id={formId} onSubmit={handleSubmit(onValid)} noValidate>
          <label htmlFor={contentFieldId} className={formLabel}>
            Content
          </label>
          <textarea
            id={contentFieldId}
            className={multilineInput}
            {...register("content")}
          />
        </form>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            className={secondaryButton}
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            form={formId}
            disabled={isSubmitting}
            className={primaryButton}
          >
            Save
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default function TextFileEditorModal() {
  const { state, dispatch } = useFileSystem();

  const fileNode = useMemo(() => {
    const id = state.editor.nodeId;
    if (!state.editor.open || !id) return null;
    const node = state.nodesById[id];
    if (!node || node.type !== "file") return null;
    return node as FSFileNode;
  }, [state.editor.nodeId, state.editor.open, state.nodesById]);

  if (!state.editor.open || !fileNode) return null;

  return (
    <EditorInner key={fileNode.id} fileNode={fileNode} dispatch={dispatch} />
  );
}
