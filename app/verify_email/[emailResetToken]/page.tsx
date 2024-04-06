"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Button from "@/app/components/UI/Button/Button";
import LoadingSpinner from "@/app/components/UI/LoadingSpinner/LoadingSpinner";
import { IoShieldCheckmark } from "react-icons/io5";
import { BiSolidError } from "react-icons/bi";
import bg from "@/public/images/f.jpeg";
import HttpRequest from "@/store/services/HttpRequest";

interface VerifyEmailProps {
  params: any;
  searchParams: any;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ params }) => {
  const router = useRouter();

  const [seconds, setSeconds] = useState<number>(5);
  const [requestFailed, setRequestFailed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get the token from the url
  const { emailResetToken } = params;

  useEffect(() => {
    (async () => {
      try {
        await HttpRequest.patch(`/auth/verifyEmail/${emailResetToken}`, {});
        setRequestFailed(() => false);
      } catch (error) {
        setRequestFailed(() => true);
      } finally {
        setIsLoading(() => false);
      }
    })();
  }, [router, emailResetToken]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (!isLoading && seconds > 0) {
        setSeconds((prevSeconds) => prevSeconds - 1);
      } else if (seconds === 0 && !requestFailed) {
        router.push("/");
      }
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(timerInterval);
  }, [router, isLoading, seconds, requestFailed]);

  return (
    <section
      className="verify"
      style={{
        backgroundImage: `url(${bg.src})`,
      }}
    >
      {isLoading && <LoadingSpinner color="white" />}
      {!isLoading && !requestFailed && (
        <div className="verify-card">
          <IoShieldCheckmark className="verify-icon__success" />
          <h4 className="verify-card__success">
            Your email has been successfully verified!
          </h4>
          <p className="verify-card__para">
            Redirecting in {seconds} second{seconds === 0 ? "" : "s"}
          </p>
        </div>
      )}
      {/* Not loading and the reqeust failed */}
      {!isLoading && requestFailed && (
        <div className="verify-card">
          <BiSolidError className="verify-icon__error" />
          <h4 className="verify-card__error">
            Email verification failed. Try signing up again!
          </h4>
          <Button onClick={() => router.push("/")} type="button">
            Signup Again
          </Button>
        </div>
      )}
    </section>
  );
};
export default VerifyEmail;