import React from "react";
import { Card, Chip, Row, SearchIcon } from "@/components/StyledComponents";
import SearchInput from "@/components/SearchInput";

export default function Home() {
  return (
    <div
      className="inset-center center z-50"
      style={{
        width: 600,
        maxHeight: "100vh",
      }}
    >
      <Card>
        <Chip>
          <Row>
            <SearchIcon className="mr-2" />
            <SearchInput />
          </Row>
        </Chip>
      </Card>
    </div>
  );
}
