import { useRecoilValue } from "recoil";

import { entityDataState } from "@/state";
import EntityCard from "./EntityCard";

export default function Entity() {
  const entityData = useRecoilValue(entityDataState);

  return (
    <div className="w-96 m-auto">
      <div className="text-3xl font-bold">{entityData.name}</div>
      <div className="py-2 font-normal">{entityData.bio}</div>
      {entityData.similar.map((entity: any) => {
        return <EntityCard key={entity} entity={entity} />;
      })}
    </div>
  );
}
