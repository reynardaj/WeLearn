"use client";

import { Button } from "@/components/Buttons";
import ProgressIndicator from "@/components/ProgressIndicator";
import React, { useState } from "react";
import { Heading2, Title } from "@/components/Heading";
import { TextMd } from "@/components/Text";
import { useRouter } from "next/navigation";
import ProfileImageUpload from "@/components/form/ProfileImageUpload";
import CertificatesUpload from "@/components/form/CertificatesUpload";
import SubjectInput from "@/components/subject-input";
import { Option } from "@/components/subject-input";

interface FormData {
  profileImage: File | string | null;
  introduction: string;
  experience: string;
  specializedSubjects: Option[];
  certificates: File[];
}

export default function SetupProfilePage() {
  const [formData, setFormData] = useState<FormData>({
    profileImage: null,
    introduction: "",
    experience: "",
    specializedSubjects: [],
    certificates: [],
  });

  const [uploadStatus, setUploadStatus] = useState<string>("");
  uploadStatus;
  const router = useRouter();
  const [uploading, setUploading] = useState(false); // <-- Add this line

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid =
      formData.profileImage !== null &&
      formData.introduction.trim() !== "" &&
      formData.experience.trim() !== "" &&
      formData.specializedSubjects.length > 0;

    if (!isValid) return;

    setUploading(true); // <-- Set uploading to true before upload
    setUploadStatus("");

    let profileImageUrl = formData.profileImage;

    if (formData.profileImage && formData.profileImage instanceof File) {
      try {
        const uploadData = new FormData();
        uploadData.append("file", formData.profileImage);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();
        profileImageUrl = data.url;
        setUploadStatus("Profile image uploaded!");
      } catch (err) {
        setUploadStatus("Image upload failed.");
        setUploading(false); // <-- Set uploading to false if error
        return;
      }
    }

    const finalFormData = {
      ...formData,
      profileImage: profileImageUrl,
    };

    localStorage.setItem("tutorFormData", JSON.stringify(finalFormData));
    setUploading(false); // <-- Set uploading to false after upload
    router.push("/tutor-form/step-3");
  };

  const handleIntroductionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      introduction: e.target.value,
    }));
  };

  const handleExperienceChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      experience: e.target.value,
    }));
  };

  return (
    <div className="flex justify-center gap-20 items-center w-screen h-screen bg-background">
      <div className="flex flex-col items-start justify-center">
        <Heading2 className="mb-8">Become Tutor</Heading2>
        <ProgressIndicator
          steps={[
            {
              id: 1,
              title: "About You",
              status: "done",
              route: "/tutor-form/step-1",
            },
            {
              id: 2,
              title: "Set Up Profile",
              status: "active",
            },
            {
              id: 3,
              title: "Set Price",
              status: "inactive",
              route: "/tutor-form/step-3",
            },
            {
              id: 4,
              title: "Set Availability",
              status: "inactive",
              route: "/tutor-form/step-4",
            },
          ]}
        />
      </div>
      <div className="bg-container text-text px-16 py-12 rounded-lg shadow-md max-w-[50%] w-full h-[90%] flex flex-col overflow-y-scroll">
        <Title>Set Up Profile</Title>
        <TextMd>
          Customize your tutor profile by adding details about your expertise,
          teaching style, and subjects you specialize in. A well-crafted profile
          attracts more students!
        </TextMd>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <ProfileImageUpload
            onImageChange={(file) =>
              setFormData((prev) => ({ ...prev, profileImage: file }))
            }
            uploadStatus={uploadStatus}
            defaultImageUrl={
              typeof formData.profileImage === "string"
                ? formData.profileImage
                : undefined
            }
            loading={uploading} // if you have an uploading state
          />

          <div>
            <TextMd className="block mb-2">Introduce Yourself</TextMd>
            <textarea
              name="introduction"
              className="w-full p-2 border border-gray-300 rounded-md h-24"
              required
              value={formData.introduction}
              onChange={handleIntroductionChange}
            />
          </div>

          <div>
            <TextMd className="block mb-2">Teaching Experience</TextMd>
            <textarea
              name="experience"
              className="w-full p-2 border border-gray-300 rounded-md h-24"
              required
              value={formData.experience}
              onChange={handleExperienceChange}
            />
          </div>
          <SubjectInput
            options={[
              { label: "Math", value: "math" },
              { label: "Science", value: "science" },
              { label: "English", value: "english" },
              { label: "History", value: "history" },
              { label: "Geography", value: "geography" },
            ]}
            value={formData.specializedSubjects}
            onChange={(selected) =>
              setFormData((prev) => ({
                ...prev,
                specializedSubjects: selected,
              }))
            }
          />

          <CertificatesUpload
            onFileUpload={(file: File | null) =>
              setFormData((prev) => ({
                ...prev,
                certificates: file ? [file] : [],
              }))
            }
          />

          <div className="flex justify-end">
            <Button type="submit">Next</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
