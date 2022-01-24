import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import "react-toastify/dist/ReactToastify.css";

const LOGIN_URL = "http://teama205.iptime.org/api/login";

function Login() {
  const { register, handleSubmit } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const { isLoggedIn } = useSelector((state) => state.userStatus);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      toast.warning("이미 로그인 된 사용자입니다.");
      router.push("/");
    }
  }, []);

  const onSubmit = async (data) => {
    await axios
      .post(LOGIN_URL, data)
      .then((res) => {
        const { result, id, code, name, token } = res.data;

        if (result !== "ok") {
          const reason = result.split(":");
          setErrorMessage(reason[1]);
          toast.error(`로그인 실패 : ${errorMessage}`);
          return;
        }

        localStorage.setItem("jwt", token);

        dispatch({
          type: "LOGIN",
          userInfo: {
            id,
            code,
            name,
          },
        });
      })
      .catch((err) => {
        toast.error("로그인 실패!");
        console.log(err);
      });

    toast.success("로그인 완료!");
    router.push("/");
  };

  const goSignup = () => {
    router.push("/signup");
  };

  return (
    <>
      <Header title="로그인"></Header>
      <div className="container d-flex justify-content-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-50 d-flex flex-column"
        >
          <div class="mt-5">
            <div className="fw-bold">이메일</div>
            <div class="d-flex justify-content-between mt-1">
              <div className="input-box form-floating ">
                <input
                  id="email"
                  type="email"
                  class="form-control"
                  placeholder=" "
                  {...register("email")}
                />
                <label htmlFor="email" class="">
                  <p className="text-secondary">you@example.com</p>
                </label>
                <span className="error">{errorMessage}</span>
              </div>
            </div>
          </div>
          <div class="mt-3">
            <div className="fw-bold">비밀번호</div>
            <div class="d-flex justify-content-between mt-1">
              <div className="input-box form-floating ">
                <input
                  id="password"
                  type="password"
                  class="form-control"
                  placeholder=" "
                  {...register("password")}
                />
                <label htmlFor="password" class="">
                  <p className="text-secondary">password</p>
                </label>
                <span className="error">{errorMessage}</span>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center mt-3">
            <button type="submit" class="submit-button btn btn-primary">
              로그인
            </button>
          </div>
          <div className="d-flex justify-content-center mt-5">
            <div>
              <p className="text-center">아직 회원이 아니신가요?</p>
              <button
                type="button"
                onClick={goSignup}
                class="submit-button btn btn-success"
              >
                서비스 신청
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;