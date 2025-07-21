"use client";

import { Button } from "@/components/Buttons";
import ProgressIndicator from "@/components/ProgressIndicator";
import React, { useEffect, useState } from "react";
import { Heading2, Title } from "@/components/Heading";
import { TextMd } from "@/components/Text";
import { useRouter } from "next/navigation";
import ProfileImageUpload from "@/components/form/ProfileImageUpload";
import CertificatesUpload from "@/components/form/CertificatesUpload";
import {SubjectInput} from "@/components/subject-input";
import { Option } from "@/components/subject-input";
import { getFormData, saveFormData } from "@/utils/localStorage";

interface FormData {
  profileImage: File | string | null;
  introduction: string;
  experience: string;
  specializedSubjects: Option[];
  certificates: File[];
  certificateUrls: string[];
}

export default function SetupProfilePage() {
  const [formData, setFormData] = useState<FormData>({
    profileImage: null,
    introduction: "",
    experience: "",
    specializedSubjects: [],
    certificates: [],
    certificateUrls: [],
  });

  useEffect(() => {
    const storedData = getFormData();
    setFormData({
      profileImage: storedData.profileImage,
      introduction: storedData.introduction,
      experience: storedData.experience,
      specializedSubjects: storedData.specializedSubjects,
      certificates: storedData.certificates,
      certificateUrls: storedData.certificateUrls,
    });
  }, []);

  const [uploadStatus, setUploadStatus] = useState<string>("");
  uploadStatus;
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid =
      formData.profileImage !== null &&
      formData.introduction.trim() !== "" &&
      formData.experience.trim() !== "" &&
      formData.specializedSubjects.length > 0;

    if (!isValid) return;

    setUploading(true);
    setUploadStatus("");

    let profileImageUrl = formData.profileImage;
    let certificatesUrls: string[] = [];

    if (formData.profileImage && formData.profileImage instanceof File) {
      try {
        // Upload profile image if needed
        const uploadData = new FormData();
        uploadData.append("image", formData.profileImage);
        const imageRes = await fetch("/api/tutor-form/upload-image", {
          method: "POST",
          body: uploadData,
        });

        if (!imageRes.ok) throw new Error("Image upload failed");

        const imageData = await imageRes.json();
        profileImageUrl = imageData.imageUrl;
        setUploadStatus("Profile image uploaded!");
      } catch (err) {
        setUploadStatus("Image upload failed.");
        setUploading(false);
        return;
      }
    }
    if (formData.certificates.length > 0) {
      // Upload certificates
      // Only upload actual File objects (not URLs from localStorage)
      const filesToUpload = formData.certificates.filter(
        (f) => f instanceof File
      );
      console.log("Files to upload:", filesToUpload);
      filesToUpload.forEach((file, idx) => {
        console.log(`File[${idx}]:`, file.name, file.type, file.size);
      });
      if (filesToUpload.length > 0) {
        try {
          const certData = new FormData();
          filesToUpload.forEach((file) => {
            certData.append("certificates", file);
          });
          const certRes = await fetch("/api/tutor-form/upload-certificates", {
            method: "POST",
            body: certData,
          });
          console.log("certRes status:", certRes.status);
          if (!certRes.ok) {
            const errorText = await certRes.text();
            console.error("Certificate upload failed:", errorText);
            setUploadStatus("Certificate upload failed: " + errorText);
            setUploading(false);
            return;
          }
          const certResult = await certRes.json();
          console.log("certResult:", certResult);
          certificatesUrls =
            certResult.certificates?.map((c: any) => c.url) || [];
          console.log(certificatesUrls);
          setUploadStatus("Certificates uploaded!");
        } catch (err) {
          setUploadStatus("Certificate upload failed.");
          setUploading(false);
          return;
        }
      }
    }

    // Update certificateUrls in formData
    setFormData((prev) => ({ ...prev, certificateUrls: certificatesUrls }));

    const finalFormData = {
      ...formData,
      profileImage: profileImageUrl,
      certificateUrls: certificatesUrls,
    };
    saveFormData(finalFormData);

    setUploading(false);
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
            loading={uploading}
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
            onFilesUpload={(files: File[]) =>
              setFormData((prev) => ({
                ...prev,
                certificates: files,
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
