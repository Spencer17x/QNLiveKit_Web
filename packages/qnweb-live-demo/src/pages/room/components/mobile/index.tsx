import React, { useEffect, useRef } from 'react';
import Clipboard from 'clipboard';
import { Button, message } from 'antd';
import classNames from 'classnames';

import { RoomProps } from '../_types';
import IconNoLive from '../_images/icon-nolive.svg';
import IconShare from '../_images/icon-share.svg';

import styles from './index.module.scss';

export const RoomMobile: React.FC<RoomProps & {
  onMessageValueKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}> = (props) => {
  const {
    isPlaying, playBtnVisible = true, playLoading,
    roomDetail, messages = [], messageValue, noticeVisible,
    onMessageValueChange, onMessageValueKeyDown, onClose, onNoticeVisibleChange,
    onPlay
  } = props;
  const chatMainEl = useRef<HTMLDivElement>(null);

  /**
   * 初始化复制器
   */
  useEffect(() => {
    const clipboard = new Clipboard('.share');
    clipboard.on('success', () => {
      message.success('播放地址已复制到剪贴板');
    });
    return () => {
      clipboard.destroy();
    };
  }, []);

  /**
   * 滚动到底部
   */
  useEffect(() => {
    const chatGoBottom = () => {
      const scrollHeight = chatMainEl.current?.scrollHeight || 0;
      const clientHeight = chatMainEl.current?.clientHeight || 0;
      chatMainEl.current?.scrollTo(0, scrollHeight - clientHeight);
    };
    chatGoBottom();
  }, [messages]);

  return (
    <div className={styles.page}>
      <div className={styles.playerContainer}>
        <div
          className={classNames({
            hidden: !isPlaying
          }, styles.player)}
          id="player"
        />
      </div>
      <div className={styles.liveContainer}>
        <div className={styles.top}>
          <div className={styles.roomInfoContainer}>
            <div className={styles.roomInfo}>
              <div className={styles.avatar}>
                <img src={roomDetail?.avatar} alt="avatar"/>
              </div>
              <div className={styles.info}>
                <div className={styles.title}>{roomDetail?.title}</div>
                <div className={styles.data}>
                  <span>{roomDetail?.onlineCount || 0}观看</span>
                </div>
              </div>
            </div>
            <div className={styles.notice} onClick={() => onNoticeVisibleChange?.(!noticeVisible)}>
              <span>公告</span>
              {
                noticeVisible && (
                  <div className={styles['notice-content']}>
                    {roomDetail?.notice}
                  </div>
                )
              }
            </div>
          </div>
          <div className={styles.close} onClick={onClose}>
            X
          </div>
        </div>
        <div className={styles.interaction}>
          <div className={styles.chatWindow} ref={chatMainEl}>
            {
              messages.map((data, index) => (
                <div className={styles.chatItem} key={index}>
                  <span className={styles.emphasize}>{data.nickname ? data.nickname + '：' : ''}</span>
                  <span dangerouslySetInnerHTML={{ __html: data.content }}></span>
                </div>
              ))
            }
          </div>
          <div className={styles.operations}>
            <input
              type="text"
              className={styles.chatInput}
              placeholder="和主播说点什么..."
              onKeyDown={onMessageValueKeyDown}
              value={messageValue}
              onChange={(e) => onMessageValueChange(e.target.value)}
            />
            <div
              className={`${styles.operationBtn} share`}
              data-clipboard-text={window.location.href}
            >
              <img
                src={IconShare}
                alt="icon-share"
              />
            </div>
          </div>
        </div>
      </div>
      {
        !isPlaying && (
          <div className={styles.noLive}>
            <div className={styles.noLivePlaceholder}>
              <img
                src={IconNoLive}
                alt="no-live"
              />
              <span>主播正在路上，请稍等～</span>
            </div>
            {playBtnVisible && <Button loading={playLoading} type="primary" onClick={onPlay}>点击播放</Button>}
          </div>
        )
      }
    </div>
  );
};
