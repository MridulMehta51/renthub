import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ContractInput } from "./ContractInput";
import { getFunctionInputKey, getInitalTupleFormState } from "./utilsContract";
import { replacer } from "~~/utils/scaffold-eth/common";
import { AbiParameterTuple } from "~~/utils/scaffold-eth/contract";

type TupleProps = {
  abiTupleParameter: AbiParameterTuple;
  setParentForm: Dispatch<SetStateAction<Record<string, any>>>;
  parentStateObjectKey: string;
  parentForm: Record<string, any> | undefined;
};

export const Tuple = ({ abiTupleParameter, setParentForm, parentStateObjectKey }: TupleProps) => {
  const [form, setForm] = useState<Record<string, any>>(() => getInitalTupleFormState(abiTupleParameter));

  useEffect(() => {
    const values = Object.values(form);
    const argsStruct: Record<string, any> = {};
    abiTupleParameter.components.forEach((component, componentIndex) => {
      argsStruct[component.name || `input_${componentIndex}_`] = values[componentIndex];
    });

    setParentForm(parentForm => ({ ...parentForm, [parentStateObjectKey]: JSON.stringify(argsStruct, replacer) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(form, replacer)]);

  return (
    <div>
      <div className="collapse collapse-arrow border-2 border-secondary bg-base-200 py-1.5 pl-4">
        <input type="checkbox" className="peer min-h-fit" />
        <div className="collapse-title min-h-fit p-0 text-primary-content/50 peer-checked:mb-2">
          <p className="m-0 p-0 text-[1rem]">{abiTupleParameter.internalType}</p>
        </div>
        <div className="collapse-content ml-3 flex-col space-y-4 border-l-2 border-secondary/80 pl-4">
          {abiTupleParameter?.components?.map((param, index) => {
            const key = getFunctionInputKey(abiTupleParameter.name || "tuple", param, index);
            return <ContractInput setForm={setForm} form={form} key={key} stateObjectKey={key} paramType={param} />;
          })}
        </div>
      </div>
    </div>
  );
};
