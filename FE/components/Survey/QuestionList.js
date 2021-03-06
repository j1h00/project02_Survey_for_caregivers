import React from "react";
import cn from "classnames";
import ct from "../../styles/detail.module.css";
import PieChartAge from "./PieChartAge";
import PieChartGender from "./PieChartGender";
import BarChart from "./BarChart";

const QuestionList = ({ total, dataList, dataresult, category }) => {
  if (dataList) {
    return (
      <div className="mt-3 m-5">
        <div className="mb-5 d-flex flex-column flex-lg-row justify-content-around">
          {dataresult.length == 0 && total == 0 && (
            <div>연령/성별 데이터가 없습니다.</div>
          )}
          {dataresult.length != 0 && total != 0 && (
            <PieChartAge total={total} result={dataresult} />
          )}
          {dataresult.length != 0 && total != 0 && (
            <PieChartGender total={total} result={dataresult} />
          )}
        </div>

        <div className={cn(ct.questionListResult)}>문항별 응답현황</div>
        {dataList
          ? dataList.map((item, index) => {
              return (
                <div name="질문" className={cn(ct.questionList)} key={index}>
                  <div className={cn(ct.question)}>
                    {item.order}. {item.context}
                  </div>
                  {item.type == 0 && total != 0 && item.option && (
                    <BarChart total={total} item={item} />
                  )}
                  <div className={cn(ct.moretext)}>
                    {item.type == 1 && item.answer && item.answer.length != 0
                      ? item.answer.map((answer, index) => {
                          if (answer.answer != "") {
                            return <p key={index}>- {answer.answer}</p>;
                          }
                        })
                      : null}
                  </div>
                  {item.option
                    ? item.option.map((opt, index) => {
                        return (
                          <div key={index} className={cn(ct.option)}>
                            <div>
                              <span>- {opt.context}</span>
                              {category == 0 ? (
                                <span> [배점 : {opt.weight}]</span>
                              ) : (
                                ""
                              )}
                            </div>

                            <div className={cn(ct.optionCnt)}>
                              <span>선택횟수 : </span>
                              <span>{opt.count} </span>
                              {opt.count != 0 && (
                                <span>
                                  ({Math.round((opt.count / total) * 100)}%)
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    : ""}
                </div>
              );
            })
          : ""}
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default QuestionList;
