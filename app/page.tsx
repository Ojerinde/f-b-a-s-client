"use client";
import Image from "next/image";
import { useState } from "react";
import LoginForm from "./components/AuthComponents/LoginForm";
import SignupForm from "./components/AuthComponents/SignupForm";

const LandingPage = () => {
  const [formType, setFormType] = useState<string>("login");
  return (
    <section className="landing-page">
      <div className="landing-page__container">
        <div className="landing-page__image">
          <figure
            style={{ position: "relative", height: "100%", width: "100%" }}
          >
            <Image
              src="/images/f.jpeg"
              alt="Smart attendance"
              fill
              style={{
                objectFit: "cover",
                position: "absolute",
              }}
              quality={100}
            />
          </figure>
        </div>
        <div className="landing-page__form">
          <header className="landing-page__header">
            <figure className="">
              <Image
                src="/images/unilorin.jpeg"
                alt="Smart attendance"
                width={100}
                height={100}
              />
            </figure>
            <div className="landing-page__buttons">
              <button
                className={`${formType === "login" ? "active-button" : ""}`}
                onClick={() => setFormType("login")}
              >
                LOGIN
              </button>
              <button
                className={`${formType === "signup" ? "active-button" : ""}`}
                onClick={() => setFormType("signup")}
              >
                SIGNUP
              </button>
            </div>
          </header>
          <section>
            {formType === "login" ? <LoginForm /> : <SignupForm />}
          </section>
        </div>
      </div>
    </section>
  );
};
export default LandingPage;
