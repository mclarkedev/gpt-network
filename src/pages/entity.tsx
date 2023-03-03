import React from "react";
import NavigationHeader from "@/components/NavigationHeader";
import Entity from "@/components/Entity";
import Link from "next/link";
import CommandModal from "@/components/CommandModal";

const BackButton = () => {
  return <Link href={"/"}>Back</Link>;
};

export default function EntityScreen() {
  return (
    <>
      <CommandModal />
      <NavigationHeader LeftSlot={BackButton} />
      <Entity />
    </>
  );
}
