import { useState } from "react";
import { useSelector } from "react-redux";
import router from "next/router";
import FileInput from "../FileInput";
import Link from "next/link";
import { toast } from "react-toastify";
import axios from "axios";
import { getPrevDate, getNextDate } from "../getDate";
import cn from "classnames";
import cs from "../../styles/postcreate.module.css";

const EventForm = () => {
  const todayDate = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(todayDate);

  const [values, setValues] = useState({
    title: "",
    context: "",
    start_at: "",
    end_at: "",
    imgFile: null,
  });

  const { userInfo } = useSelector((state) => state.userStatus);
  const hospital_id = userInfo.id;
  const EVENT_URL = `${process.env.NEXT_PUBLIC_SERVER}/api/event/${hospital_id}`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const handleChange = (name, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    if (name === "start_at") {
      setStartDate(value);
    }
  };

  //작성완료
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    for (let key in values) {
      if (key === "imgFile") {
        if (values[key] != null) {
          const imgFile = values[key];
          const imgName = imgFile.name;
          fd.append("event_img", imgFile);
          fd.append("attachment", imgName);
        }
      } else {
        fd.append(`${key}`, values[key]);
      }
    }

    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      router.reload();
    }

    await axios
      .post(EVENT_URL, fd, {
        headers: {
          authorization: jwt,
          "Content-Type": `multipart/form-data`,
        },
      })
      .then((res) => {
        toast.success("이벤트 등록 완료!", {
          autoClose: 3000,
        });
        router.push(`/event/${res.data.id}`);
      })
      .catch((err) => {
        toast.error("이벤트 등록 실패!", {
          autoClose: 3000,
        });
        console.log(err);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div name="form" className={cn(cs.form)}>
        <div name="제목" className={cn(cs.formRow, "d-flex")}>
          <div className={cn(cs.formLabel)}>
            <label htmlFor="title">
              <span className={cn(cs.star)}>*{"  "}</span>
              <span>제목</span>
            </label>
          </div>

          <div className={cn(cs.formControl)}>
            <input
              className={cn(cs.input)}
              name="title"
              value={values.title}
              onChange={handleInputChange}
              id="title"
              required
            ></input>
          </div>
        </div>

        <div className={cn(cs.formRow, "d-flex")}>
          <div className={cn(cs.formLabel)}>
            <label htmlFor="start_at">
              <span className={cn(cs.star)}>*{"  "}</span>
              <span>시작일</span>
            </label>{" "}
            ~ <label htmlFor="end_at">마감일</label>
          </div>
          <div className={cn(cs.formControl)}>
            <input
              id="start_at"
              name="start_at"
              type="date"
              onChange={handleInputChange}
              value={values.start_at}
              min={todayDate}
              max={getPrevDate(values.end_at)}
              required
            ></input>
            <span>
              {"  "}~{"  "}
            </span>
            <input
              id="end_at"
              name="end_at"
              type="date"
              onChange={handleInputChange}
              value={values.end_at}
              min={getNextDate(startDate)}
              required
            ></input>
          </div>
        </div>

        <div className={cn(cs.formRow, "d-flex")}>
          <div className={cn(cs.formLabel)}>
            <label htmlFor="context">
              <span className={cn(cs.star)}>*{"  "}</span>
              <span>내용</span>
            </label>
          </div>
          <div className={cn(cs.formControl)}>
            <textarea
              className={cn(cs.textarea)}
              name="context"
              value={values.context}
              onChange={handleInputChange}
              id="context"
              rows="20"
              required
            ></textarea>
          </div>
        </div>
        <div className={cn(cs.formRow)}>
          <FileInput
            name="imgFile"
            value={values.imgFile}
            onChange={handleChange}
          ></FileInput>
        </div>
      </div>

      <div className={cn(cs.btns, "d-flex")}>
        <div className={cn(cs.btn)}>
          <Link href="/event/" passHref>
            <button className="btn btn-secondary">취소</button>
          </Link>
        </div>
        <div className={cn(cs.btn)}>
          <button type="submit" className="btn btn-primary">
            등록
          </button>
        </div>
      </div>
    </form>
  );
};

export default EventForm;
