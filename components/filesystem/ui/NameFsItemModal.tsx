"use client";

import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import { useFileSystem } from "../context/FileSystemProvider";
import { nameExistsAmongSiblings } from "../utils";
import {
  fieldError,
  formLabel,
  primaryButton,
  secondaryButton,
  textInput,
} from "./fileSystemStyles";

export type NameModalMode =
  | { action: "create"; kind: "folder" | "file" }
  | { action: "rename"; nodeId: string };

type FormValues = { name: string };

type Props = {
  open: boolean;
  mode: NameModalMode;
  onClose: () => void;
};

export default function NameFsItemModal({ open, mode, onClose }: Props) {
  const { state, dispatch } = useFileSystem();
  const formId = useId();
  const dialogTitleId = useId();

  const node =
    mode.action === "rename" ? state.nodesById[mode.nodeId] : undefined;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { name: "" },
    mode: "onChange",
  });

  useEffect(() => {
    if (!open) return;
    if (mode.action === "rename" && node) {
      reset({ name: node.name });
    } else {
      reset({ name: "" });
    }
  }, [open, mode, node, reset]);

  useEffect(() => {
    if (open && mode.action === "rename" && !state.nodesById[mode.nodeId]) {
      onClose();
    }
  }, [open, mode, state.nodesById, onClose]);

  const handleDismiss = () => {
    onClose();
    reset({ name: "" });
  };

  const parentDirId =
    mode.action === "rename" ? (node?.parentId ?? null) : state.currentDirId;

  const excludeNodeId = mode.action === "rename" ? mode.nodeId : undefined;

  const title =
    mode.action === "create"
      ? mode.kind === "folder"
        ? "Add new folder"
        : "Add new file"
      : node?.type === "dir"
        ? "Rename folder"
        : "Rename file";

  const placeholder =
    mode.action === "create"
      ? mode.kind === "folder"
        ? "Folder name"
        : "File name"
      : node?.type === "dir"
        ? "Folder name"
        : "File name";

  const submitLabel = mode.action === "create" ? "Create" : "Save";

  const onValid = (data: FormValues) => {
    const trimmed = data.name.trim();
    if (!trimmed) {
      setError("name", { message: "Name is required" });
      return;
    }
    if (
      parentDirId &&
      nameExistsAmongSiblings(
        state.nodesById,
        state.childrenByDirId,
        parentDirId,
        trimmed,
        excludeNodeId,
      )
    ) {
      setError("name", {
        message: "A file or folder with this name already exists here.",
      });
      return;
    }

    if (mode.action === "create") {
      if (mode.kind === "folder") {
        dispatch({
          type: "ADD_FOLDER",
          parentDirId: state.currentDirId,
          name: trimmed,
        });
      } else {
        dispatch({
          type: "ADD_TEXT_FILE",
          parentDirId: state.currentDirId,
          name: trimmed,
        });
      }
    } else {
      dispatch({ type: "RENAME_NODE", nodeId: mode.nodeId, newName: trimmed });
    }

    handleDismiss();
  };

  if (mode.action === "rename" && !node) return null;

  return (
    <Modal open={open} onClose={handleDismiss} aria-labelledby={dialogTitleId}>
      <Modal.Header>
        <h2
          id={dialogTitleId}
          className="min-w-0 flex-1 truncate text-sm font-semibold"
        >
          {title}
        </h2>
      </Modal.Header>
      <Modal.Body>
        <form id={formId} onSubmit={handleSubmit(onValid)} noValidate>
          <label htmlFor={`${formId}-name`} className={formLabel}>
            Name
          </label>
          <input
            id={`${formId}-name`}
            type="text"
            autoComplete="off"
            autoFocus
            className={textInput}
            placeholder={placeholder}
            {...register("name", {
              required: "Name is required",
              validate: (v) => v.trim().length > 0 || "Enter a name",
            })}
          />
          {errors.name ? (
            <p className={fieldError} role="alert">
              {errors.name.message}
            </p>
          ) : null}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            className={secondaryButton}
            onClick={handleDismiss}
          >
            Cancel
          </button>
          <button
            type="submit"
            form={formId}
            disabled={isSubmitting}
            className={primaryButton}
          >
            {submitLabel}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
