import React from "react";
import cn from "classnames";
import { useInfiniteQuery } from "@taigalabs/prfs-react-lib/react_query";
import { useVirtualizer } from "@taigalabs/prfs-react-lib/react_virtual";
import { shyApi2 } from "@taigalabs/shy-api-js";
import dayjs from "dayjs";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";

import styles from "./Board.module.scss";
import Row from "./Row";
import {
  InfiniteScrollRowContainer,
  InfiniteScrollRowWrapper,
} from "@/components/infinite_scroll/InfiniteScrollComponents";
import Loading from "@/components/loading/Loading";

const Board: React.FC<BoardProps> = ({ parentRef, channelId, className, placeholder }) => {
  const i18n = usePrfsI18N();
  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["get_shy_topics", channelId],
      queryFn: async ({ pageParam = 0 }) => {
        return await shyApi2({
          type: "get_shy_topics",
          channel_id: channelId,
          offset: pageParam,
        });
      },
      initialPageParam: 0,
      getNextPageParam: lastPage => {
        if (lastPage.payload) {
          return lastPage.payload.next_offset;
        } else {
          return null;
        }
      },
    });

  const allRows = data
    ? data.pages.flatMap(d => {
        if (d.payload) {
          return d.payload.shy_topic_syn1s;
        } else {
          [];
        }
      })
    : [];

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 74,
    overscan: 5,
  });

  const now = dayjs();

  React.useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (lastItem.index >= allRows.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allRows.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  if (status === "pending") {
    return (
      <Loading centerAlign>
        <Spinner />
      </Loading>
    );
  }

  const virtualItems = rowVirtualizer.getVirtualItems();
  return (
    <InfiniteScrollRowContainer
      className={cn(styles.infiniteScroll, className)}
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
        position: "relative",
      }}
    >
      {status === "success" && virtualItems.length === 0 && (
        <div className={styles.emptyBoard}>{placeholder ?? i18n.no_records_to_show}</div>
      )}
      {virtualItems.map(virtualRow => {
        const isLoaderRow = virtualRow.index > allRows.length - 1;
        const topic = allRows[virtualRow.index];
        return (
          <InfiniteScrollRowWrapper
            style={{
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
            className={styles.row}
            key={virtualRow.index}
            data-index={virtualRow.index}
            ref={rowVirtualizer.measureElement}
          >
            {isLoaderRow
              ? hasNextPage
                ? "Loading more..."
                : "Nothing more to load"
              : topic && <Row topic={topic} now={now} channelId={channelId} />}
          </InfiniteScrollRowWrapper>
        );
      })}
    </InfiniteScrollRowContainer>
  );
};

export default Board;

export interface BoardProps {
  parentRef: React.MutableRefObject<HTMLDivElement | null>;
  channelId: string;
  className?: string;
  placeholder?: React.ReactNode;
}
