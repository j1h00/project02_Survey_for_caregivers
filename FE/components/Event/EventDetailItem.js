import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import axios from "axios";
import DateForm from "../DateForm";

const EventDetailItem = () => {
  const [data, setData] = useState([]);
  // 게시글 id 찾기
  const router = useRouter();
  const { id } = router.query;

  // 데이터 보내는 서버 url 작성
  const { userInfo } = useSelector((state) => state.userStatus);
  const hospital_id = userInfo.id;
  //   const EVENT_DETAIL_URL = `http://i6a205.p.ssafy.io:8000/api/event/${hospital_id}/${post_id}`;
  const EVENT_DETAIL_URL = `http://i6a205.p.ssafy.io:8000/api/event/1/${id}`;

  useEffect(() => {
    // 게시글 내용 받아오기
    const getPost = async () => {
      const res = await axios.get(EVENT_DETAIL_URL);
      const data = res.data[0];
      console.log("data", data);
      setData(data);
    };
    getPost();
  }, []);

  return (
    <div className="post-detail">
      <div className="post-detail-header">
        <h2 className="detail-title">
          <div>제목 : {data.title}</div>
        </h2>
        <div className="detail-info">
          <p>작성자 : 관리자</p>
          <p>작성일 : {DateForm(data.created_at)}</p>
          <p>조회수 : {data.views}</p>
          <div>
            <p>
              이벤트 기한 : {DateForm(data.start_at)} ~ {DateForm(data.end_at)}
            </p>
          </div>
        </div>
      </div>
      <div className="post-detail-body">
        <div>
          {/* 수정사항 첨부파일 있을때만 보이게 만들기  */}
          {/* <div className="detail-file">첨부파일
          {data.event_img}</div> */}
        </div>
        <hr></hr>
        <div className="detail-context">{data.context}</div>
      </div>
    </div>
  );
};

export default EventDetailItem;