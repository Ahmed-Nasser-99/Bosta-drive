"use client";

import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import { useFileSystem } from "../../context/FileSystemProvider";
import { nameExistsAmongSiblings } from "../../utils";
import {
  fieldError,
  formLabel,
  primaryButton,
  secondaryButton,
  textInput,
} from "../fileSystemStyles";

type FormValues = { name: string };

type Props = {
  open: boolean;
  nodeId: string | null;
  onClose: () => void;
};

export default function RenameFsItemModal({ open, nodeId, onClose }: Props) {
  const { state, dispatch } = useFileSystem();
  const formId = useId();
  const dialogTitleId = useId();
  const node = nodeId ? state.nodesById[nodeId] : undefined;
  const parentDirId = node?.parentId ?? null;

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
    if (open && node) reset({ name: node.name });
  }, [open, node, reset]);

  useEffect(() => {
    if (open && nodeId && !state.nodesById[nodeId]) onClose();
  }, [open, nodeId, state.nodesById, onClose]);

  const handleDismiss = () => {
    onClose();
    reset({ name: "" });
  };

  const onValid = (data: FormValues) => {
    if (!nodeId || !node || !parentDirId) return;
    const trimmed = data.name.trim();
    if (!trimmed) {
      setError("name", { message: "Name is required" });
      return;
    }
    if (
      nameExistsAmongSiblings(
        state.nodesById,
        state.childrenByDirId,
        parentDirId,
        trimmed,
        nodeId
      )
    ) {
      setError("name", {
        message: "A file or folder with this name already exists here.",
      });
      return;
    }
    dispatch({ type: "RENAME_NODE", nodeId, newName: trimmed });
    handleDismiss();
  };

  if (!node) return null;

  const title = node.type === "dir" ? "Rename folder" : "Rename file";

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
            className={textInput}
            placeholder={node.type === "dir" ? "Folder name" : "File name"}
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
            Save
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
