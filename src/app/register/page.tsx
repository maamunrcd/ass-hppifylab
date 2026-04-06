"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerAction } from "@/features/auth/auth.actions";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const password = String(formData.get("password") ?? "");
    const repeatPassword = String(formData.get("repeatPassword") ?? "");

    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!formData.get("terms")) {
      setError("Please agree to the terms & conditions.");
      setLoading(false);
      return;
    }

    const result = await registerAction({
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      password,
    });

    if (result.success) {
      router.push("/feed");
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <section className="_social_registration_wrapper _layout_main_wrapper">
      <div className="_shape_one">
        <img src="/assets/images/shape1.svg" alt="" className="_shape_img" />
        <img src="/assets/images/dark_shape.svg" alt="" className="_dark_shape" />
      </div>
      <div className="_shape_two">
        <img src="/assets/images/shape2.svg" alt="" className="_shape_img" />
        <img
          src="/assets/images/dark_shape1.svg"
          alt=""
          className="_dark_shape _dark_shape_opacity"
        />
      </div>
      <div className="_shape_three">
        <img src="/assets/images/shape3.svg" alt="" className="_shape_img" />
        <img
          src="/assets/images/dark_shape2.svg"
          alt=""
          className="_dark_shape _dark_shape_opacity"
        />
      </div>
      <div className="_social_registration_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_registration_right">
                <div className="_social_registration_right_image">
                  <img src="/assets/images/registration.png" alt="" />
                </div>
                <div className="_social_registration_right_image_dark">
                  <img src="/assets/images/registration1.png" alt="" />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_registration_content">
                <div className="_social_registration_right_logo _mar_b28">
                  <img
                    src="/assets/images/logo.svg"
                    alt=""
                    className="_right_logo"
                  />
                </div>
                <p className="_social_registration_content_para _mar_b8">
                  Get Started Now
                </p>
                <h4 className="_social_registration_content_title _titl4 _mar_b50">
                  Registration
                </h4>
                <button
                  type="button"
                  className="_social_registration_content_btn _mar_b40 w-100"
                >
                  <img
                    src="/assets/images/google.svg"
                    alt=""
                    className="_google_img"
                  />
                  <span>Register with google</span>
                </button>
                <div className="_social_registration_content_bottom_txt _mar_b40">
                  <span>Or</span>
                </div>
                <form className="_social_registration_form" onSubmit={handleSubmit}>
                  {error ? (
                    <div
                      className="alert alert-danger _mar_b14"
                      role="alert"
                      style={{ fontSize: 14 }}
                    >
                      {error}
                    </div>
                  ) : null}
                  <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label
                          htmlFor="firstName"
                          className="_social_registration_label _mar_b8"
                        >
                          First name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          className="form-control _social_registration_input"
                          placeholder="First name"
                          required
                          autoComplete="given-name"
                        />
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label
                          htmlFor="lastName"
                          className="_social_registration_label _mar_b8"
                        >
                          Last name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          className="form-control _social_registration_input"
                          placeholder="Last name"
                          required
                          autoComplete="family-name"
                        />
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label
                          htmlFor="email"
                          className="_social_registration_label _mar_b8"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-control _social_registration_input"
                          placeholder="Email"
                          required
                          autoComplete="email"
                        />
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label
                          htmlFor="password"
                          className="_social_registration_label _mar_b8"
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          className="form-control _social_registration_input"
                          placeholder="Password (min. 8 characters)"
                          required
                          minLength={8}
                          autoComplete="new-password"
                        />
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label
                          htmlFor="repeatPassword"
                          className="_social_registration_label _mar_b8"
                        >
                          Repeat Password
                        </label>
                        <input
                          type="password"
                          id="repeatPassword"
                          name="repeatPassword"
                          className="form-control _social_registration_input"
                          placeholder="Repeat password"
                          required
                          minLength={8}
                          autoComplete="new-password"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
                      <div className="form-check _social_registration_form_check">
                        <input
                          className="form-check-input _social_registration_form_check_input"
                          type="checkbox"
                          name="terms"
                          id="termsAgree"
                          required
                        />
                        <label
                          className="form-check-label _social_registration_form_check_label"
                          htmlFor="termsAgree"
                        >
                          I agree to terms & conditions
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                      <div className="_social_registration_form_btn _mar_t40 _mar_b60">
                        <button
                          type="submit"
                          className="_social_registration_form_btn_link _btn1 w-100"
                          disabled={loading}
                        >
                          {loading ? "Creating account…" : "Register now"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="_social_registration_bottom_txt">
                      <p className="_social_registration_bottom_txt_para">
                        Already have an account? <Link href="/login">Login</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
