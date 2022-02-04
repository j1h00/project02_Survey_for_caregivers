import React from "react";
import Header from "../../../components/Header";
import NoticeDetailItem from "../../../components/Notice/NoticeDetailItem";

function NoticeDetail() {
  return (
    <div>
      <Header title="Vote24 공지사항"></Header>
      <div className="container">
        <NoticeDetailItem></NoticeDetailItem>
      </div>
    </div>
  );
}

export default NoticeDetail;