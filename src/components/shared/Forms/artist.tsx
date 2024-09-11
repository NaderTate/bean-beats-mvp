"use client";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { upload } from "@vercel/blob/client";
import { Artist } from "@prisma/client";

import Spinner from "../spinner";

import { updateArtist } from "@/actions/artists";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Input from "../Input";
import { uploadFile } from "@/utils/upload-files";
import FileUploader from "@/components/file-dropzone";
import Button from "@/components/button";
import toast from "react-hot-toast";

type Inputs = {
  name: string;
  image: FileList | string;
};

export default function ArtistForm({
  onSubmit,
  itemToEdit: artist,
}: {
  onSubmit: () => void;
  itemToEdit?: Artist;
}) {
  const id = artist?.id;
  const {
    control,
    register,
    handleSubmit,
    formState: { isLoading, isSubmitting, errors },
  } = useForm<Inputs>({
    defaultValues: {
      name: artist?.name,
      image: artist?.image,
    },
  });

  const t = useTranslations();

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        if (data.image === null) {
          return alert("No file selected");
        }

        const newBlob =
          typeof data.image === "string"
            ? { url: data.image } // If it's a URL, just use it
            : data.image?.length > 0
            ? await uploadFile(data.image[0])
            : { url: artist?.image }; // If no new file is uploaded, keep the existing image URL

        if (id) {
          await updateArtist({
            id,
            data: {
              ...data,
              image: newBlob.url,
            },
          });
          toast.success("Artist updates successfully");
        } else {
          await fetch("/api/artists", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...data, image: newBlob.url }),
          });
          toast.success("Artist created successfully");
        }

        onSubmit();
      })}
      className="space-y-4"
    >
      <Controller
        control={control}
        name="name"
        rules={{ required: "This field is required" }}
        render={({ field }) => (
          <Input
            label={"Name"}
            placeholder="Name"
            defaultValue={artist?.name || ""}
            onChange={(e) => {
              field.onChange(e.target.value);
            }}
            errMessage={errors.name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="image"
        render={({ field }) => (
          <FileUploader
            defaultImageUrl={artist?.image || ""}
            label="Image"
            onFileUpload={(url) => field.onChange(url)}
            errorMessage={errors.image?.message}
          />
        )}
      />

      <Button className="mt-4" isLoading={isSubmitting || isLoading}>
        Submit
      </Button>
    </form>
  );
}
