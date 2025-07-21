"use client";
import React, { useEffect, useState, Suspense } from "react";
import { playfair } from "@/lib/fonts";
import Rating from "@/components/TutorListingComponents/rating";
import Stack from "@mui/material/Stack";
import { Button } from "@/components/button";
import ProgressBar from "@/components/TutorProfileComponents/ProgressBar";
import ReviewList from "@/components/TutorProfileComponents/reviewList";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import BookingModal from "@/components/BookingComponents/BookingModal";
import ReviewModal from "@/components/ReviewModal";
import { Heading1, Heading2, Heading3, Heading4 } from "@/components/Heading";
import { TextSm, TextMd, TextLg } from "@/components/Text";
import { IoArrowBackOutline } from "react-icons/io5";

interface Review {
  rating: number;
  comment: string;
  name: string;
}
interface TutorData {
  tutorid: string;
  firstname: string;
  lastname: string;
  institution: string;
  price: number;
  description: string;
  experience: string;
  profileimg: string;
  subjects: string[];
  availableDays: string[];
  reviews: Review[];
}

function TutorProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tutorID = searchParams.get("tutorID");
  const [showModal, setShowModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedTutorID, setSelectedTutorID] = useState<string | null>(null);
  const [tutor, setTutor] = useState<TutorData | null>(null);

  useEffect(() => {
    if (!tutorID) return;

    fetch(`/api/tutor-profile?tutorID=${tutorID}`)
      .then((res) => res.json())
      .then((data) => setTutor(data));
  }, [tutorID, showReviewModal]);

  if (!tutor)
    return <div className="justfify-center items-center">Loading...</div>;

  const ratingCounts = [0, 0, 0, 0, 0];

  if (tutor?.reviews) {
    tutor.reviews.forEach((review) => {
      const index = review.rating - 1;
      if (index >= 0 && index <= 4) ratingCounts[index]++;
    });
  }

  const goToChat = () => {
    router.push(`/message?tutorID=${tutorID}`);
  };

  const handleBook = () => {
    if (tutorID) {
      setSelectedTutorID(tutorID);
      setShowModal(true);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F0FAF9] p-5 md:p-8 md:pr-12 md:pl-12 gap-5">
      {/* Back Button */}
      <div>
        <button onClick={goBack}>
          <IoArrowBackOutline className="text-[32px] hover:-translate-x-1 transition-transform duration-200" />
        </button>
      </div>

      {/* Tutor Header */}
      <div className="flex flex-col md:flex-row lg:flex-row gap-5 md:items-center">
        {/* Profile Picture */}
        <div className="w-28 sm:w-32 md:w-52 lg:w-56 xl:w-64 h-28 sm:h-32 md:h-52 lg:h-56 xl:h-64 rounded-2xl overflow-hidden bg-gray-200 flex-shrink-0">
          <img
            src={tutor.profileimg}
            alt={`${tutor.firstname} ${tutor.lastname}`}
            className="object-cover h-full w-full rounded-2xl"
          />
        </div>

        {/* Tutor Information */}
        <div className="flex flex-col w-full">
          <Heading1>
            {tutor.firstname} {tutor.lastname}
          </Heading1>
          <div className="flex flex-col">
            <TextLg>{tutor.experience}</TextLg>
            <TextMd>
              {tutor.subjects?.join(", ") || "No subjects listed"}
            </TextMd>
            <TextMd>Rp. {tutor.price} / hour</TextMd>
            <TextMd>
              {tutor.availableDays?.join(", ") || "No availability listed"}
            </TextMd>
            <p className="text-[13px] lg:text-[14px]">{tutor.institution}</p>
          </div>
          <div className="mt-3 flex flex-col gap-1">
            <Rating
              rating={
                tutor.reviews.length > 0
                  ? Math.round(
                      tutor.reviews.reduce((sum, r) => sum + r.rating, 0) /
                        tutor.reviews.length
                    )
                  : 0
              }
            />
            <div>
              <Stack spacing={1} direction="row">
                <Button variant="primary" onClick={handleBook}>
                  Book A Session
                </Button>
                <Button
                  variant="ghost"
                  className="border-gray-300 border-1"
                  onClick={goToChat}
                >
                  Send Message
                </Button>
              </Stack>
            </div>
            {showModal && selectedTutorID && (
              <BookingModal
                tutorID={selectedTutorID}
                onClose={() => {
                  setShowModal(false);
                  setSelectedTutorID(null);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* About Me */}
      <div>
        <Heading3>About Me</Heading3>
        <TextMd>{tutor.description}</TextMd>
      </div>

      {/* Review Section */}
      <div>
        <Heading3>What my students say</Heading3>
        <div className="flex flex-col md:flex-row gap-5 mt-3">
          {/* Rating */}
          <div className="flex flex-col gap-3 md:w-[25vw] lg:w-[20vw]">
            <Heading1>
              {tutor.reviews.length > 0
                ? (
                    tutor.reviews.reduce((sum, r) => sum + r.rating, 0) /
                    tutor.reviews.length
                  ).toFixed(1)
                : "0"}
            </Heading1>
            <Rating
              rating={
                tutor.reviews.length > 0
                  ? Math.round(
                      tutor.reviews.reduce((sum, r) => sum + r.rating, 0) /
                        tutor.reviews.length
                    )
                  : 0
              }
              color="yellow"
            />
            <TextMd>{tutor.reviews.length} reviews</TextMd>
            <div className="flex flex-col">
              {[5, 4, 3, 2, 1].map((rating) => (
                <ProgressBar
                  key={rating}
                  label={`${rating}`}
                  count={ratingCounts[rating - 1]}
                  total={tutor.reviews.length}
                />
              ))}
            </div>
            <Button
              variant="secondary"
              className="w-full lg:w-[13vw] xl:w-[10vw]"
              onClick={() => setShowReviewModal(true)}
            >
              Write A Review
            </Button>
          </div>

          {/* Review */}
          <div className="bg-white rounded-2xl shadow-md p-5 md:p-7 flex flex-col gap-9 h-[100vh] md:w-[75vw] lg:w-[80vw] overflow-y-auto scrollbar-hover">
            {tutor.reviews.length > 0 ? (
              <ReviewList reviews={tutor.reviews} />
            ) : (
              <p className="text-sm italic">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        tutorID={tutorID || ""}
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={async (review) => {
          try {
            const response = await fetch("/api/reviews", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                tutorID: review.tutorID,
                rating: review.rating,
                comment: review.comment,
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to submit review");
            }

            // Refresh the tutor data to show the new review
            const updatedTutor = await fetch(
              `/api/tutor-profile?tutorID=${tutorID}`
            ).then((res) => res.json());
            setTutor(updatedTutor);
          } catch (error) {
            console.error("Error submitting review:", error);
            // You might want to show an error toast/message here
          }
        }}
      />
    </div>
  );
}

export default function TutorProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      }
    >
      <TutorProfileContent />
    </Suspense>
  );
}
