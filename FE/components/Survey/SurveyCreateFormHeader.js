import { useState } from "react";
import CategoryRadio from "./CategoryRadio";
import cn from "classnames";
import styles from "../../styles/surveycreateformheader.module.css";

function SurveyCreateFormHeader({
  register,
  unregister,
  errors,
  nowCategory,
  setNowCategory,
}) {
  const [benchmarks, setBenchmarks] = useState([]);
  const [bCnt, setBCnt] = useState(1);

  const handleBenchmarkAdd = () => {
    setBenchmarks([...benchmarks, { id: bCnt }]);
    setBCnt((state) => state + 1);
  };

  const handleBenchmarkDelete = (inputId) => {
    setBenchmarks(benchmarks.filter((b) => b.id !== inputId));
    unregister(`C${inputId}`);
    unregister(`D${inputId}`);
    setBCnt((state) => state + 1);
  };

  const paintBenchmark = benchmarks.map((b) => {
    return (
      <div key={b.id} className="d-flex gap-1">
        <input
          id="benchmark"
          name="benchmark"
          type="url"
          className={cn(styles.benchInput, "form-control")}
          placeholder="O점 이상일때"
          {...register(`C${b.id}`)}
        ></input>
        <input
          id="benchmark"
          name="benchmark"
          type="url"
          className="survey-input-box form-control"
          placeholder="점수에 해당하는 문구를 작성하세요"
          {...register(`D${b.id}`)}
        ></input>
        <button
          className="btn material-icons p-0"
          onClick={() => handleBenchmarkDelete(b.id)}
        >
          clear
        </button>
      </div>
    );
  });

  return (
    <form className="w-100 survey-form-header">
      <CategoryRadio
        register={register}
        nowCategory={nowCategory}
        setNowCategory={setNowCategory}
      />
      <div className={cn(styles.inputBox)}>
        <input
          id="title"
          name="title"
          type="text"
          className={cn(styles.inputTag, "fs-1")}
          placeholder="설문 제목을 입력해주세요."
          autoComplete="off"
          {...register("title", { required: true })}
        ></input>
        <div className={cn(styles.inputLabel)}></div>
      </div>
      {errors.title && errors.title.type === "required" && (
        <div className="error d-flex align-items-center mt-1 bg-danger text-white p-1 rounded">
          <span className="material-icons fs-5">priority_high</span>
          <span>설문 제목 입력은 필수입니다.</span>
        </div>
      )}
      <div className="d-flex mt-3 gap-3">
        <div className={cn(styles.datetimeBox)}>
          <label htmlFor="start_at" className="fw-bold ms-1">
            시작일
          </label>
          <input
            id="start_at"
            type="datetime-local"
            className="form-control"
            {...register("start_at", { required: true })}
          ></input>
          {errors.start_at && errors.start_at.type === "required" && (
            <div className="error d-flex align-items-center mt-1 bg-danger text-white p-1 rounded">
              <span className="material-icons fs-5">priority_high</span>
              <span>시작일 입력은 필수입니다.</span>
            </div>
          )}
        </div>

        <div className={cn(styles.datetimeBox)}>
          <label htmlFor="end_at" className="fw-bold ms-1">
            종료일
          </label>
          <input
            id="end_at"
            type="datetime-local"
            className="form-control"
            {...register("end_at", { required: true })}
          ></input>

          {errors.end_at && errors.end_at.type === "required" && (
            <div className="error d-flex align-items-center mt-1 bg-danger text-white p-1 rounded">
              <span className="material-icons fs-5">priority_high</span>
              <span>종료일 입력은 필수입니다.</span>
            </div>
          )}
        </div>
      </div>
      <textarea
        id="context"
        name="context"
        className="survey-input-box form-control mt-2"
        placeholder="설문에 대한 설명을 작성해주세요."
        rows="10"
        {...register("context", { required: true })}
      ></textarea>
      {errors.context && errors.context.type === "required" && (
        <div className="error d-flex align-items-center mt-1 bg-danger text-white p-1 rounded">
          <span className="material-icons fs-5">priority_high</span>
          <span>설문 설명 입력은 필수입니다.</span>
        </div>
      )}
      {nowCategory === "0" && (
        <div>
          <div className="form-control mt-2">
            <div className="my-1">설문 결과의 기준 점수를 입력하세요.</div>
            <div>{paintBenchmark}</div>
            <button
              type="button"
              className="btn material-icons p-0"
              onClick={handleBenchmarkAdd}
            >
              add
            </button>
          </div>
          <div className="form-floating">
            <input
              id="output_link"
              name="output_link"
              type="url"
              className={cn("form-control", "mt-2")}
              placeholder=" "
              autoComplete="off"
              {...register("output_link", { required: true })}
            ></input>
            <label htmlFor="output_link" className="text-secondary">
              출력 링크(설문 후 설문자가 이동할 페이지의 링크)
            </label>
          </div>
          {errors.output_link && errors.output_link.type === "required" && (
            <div className="error d-flex align-items-center mt-1 bg-danger text-white p-1 rounded">
              <span className="material-icons fs-5">priority_high</span>
              <span>설문 참여자에게 제공되는 링크 입력은 필수입니다.</span>
            </div>
          )}
        </div>
      )}
    </form>
  );
}

export default SurveyCreateFormHeader;