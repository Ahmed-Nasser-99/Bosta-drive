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

export type CreateFsItemKind = "folder" | "file";

type FormValues = { name: string };

type Props = {
  open: boolean;
  kind: CreateFsItemKind;
  onClose: () => void;
};

export default function CreateFsItemModal({ open, kind, onClose }: Props) {
  const { state, dispatch } = useFileSystem();
  const formId = useId();
  const dialogTitleId = useId();
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
    if (open) reset({ name: "" });
  }, [open, kind, reset]);

  const title = kind === "folder" ? "Add new folder" : "Add new file";

  const onValid = (data: FormValues) => {
    const trimmed = data.name.trim();
    if (!trimmed) {
      setError("name", { message: "Name is required" });
      return;
    }
    if (
      nameExistsAmongSiblings(
        state.nodesById,
        state.childrenByDirId,
        state.currentDirId,
        trimmed
      )
    ) {
      setError("name", {
        message: "A file or folder with this name already exists here.",
      });
      return;
    }
    if (kind === "folder") {
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
    onClose();
    reset({ name: "" });
  };

  const handleDismiss = () => {
    onClose();
    reset({ name: "" });
  };

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
            placeholder={kind === "folder" ? "Folder name" : "File name"}
            {...register("name", {
              required: "Name is required",
              validate: (v) =>
                v.trim().length > 0 || "Enter a name",
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
            Create
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
