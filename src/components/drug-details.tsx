import { useEffect, useState } from "react";
import { BASE_URL } from "../lib/constants";
import { DrugConceptProperty, DrugNdcsResponse, DrugPropResponse } from "../types";

async function fetchDrug(rxcui: string): Promise<DrugConceptProperty | undefined> {
  try {
    const url = new URL(`${BASE_URL}/rxcui/${rxcui}/properties.json`);

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch drug.");

    const data = (await res.json()) as DrugPropResponse;

    return data.properties;
  } catch (err) {
    console.error(err);
  }
}

async function fetchNdcs(rxcui: string) {
  try {
    const url = new URL(`${BASE_URL}/rxcui/${rxcui}/ndcs.json`);

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch drug.");

    const data = (await res.json()) as DrugNdcsResponse;

    return data.ndcGroup.ndcList?.ndc || [];
  } catch (err) {
    console.error(err);
  }
}

export function DrugDetails({ rxcui }: { rxcui?: string }) {
  const [drugProperties, setDrugPropperties] = useState<DrugConceptProperty>();
  const [ndcs, setNdcs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async function () {
      if (!rxcui || isLoading) return;

      setIsLoading(true);
      const [properties, ndcs] = await Promise.all([fetchDrug(rxcui), fetchNdcs(rxcui)]);
      if (!!properties) setDrugPropperties(properties);
      if (!!ndcs?.length) setNdcs(ndcs);
      setIsLoading(false);
    })();
  }, [rxcui]);

  return (
    <section>
      {isLoading ? (
        <div className="text-md text-center font-semibold py-10">Loading..</div>
      ) : !drugProperties ? (
        <div className="text-md text-center font-semibold py-10 text-red-500">Invalid rxcui, no details found</div>
      ) : (
        <div className="p-3">
          <h2 className="text-xl font-semibold font-serif">{drugProperties?.name}</h2>
          <p>Synonym : {drugProperties?.synonym}</p>
          <p>Rxcui : {drugProperties?.rxcui}</p>

          <div className="flex flex-col">
            <h4 className="font-semibold">NDCS : </h4>
            <ul className="ps-2">
              {!!ndcs.length ? ndcs.map((ndc) => <li key={ndc}>{ndc}</li>) : <div className="text-md py-10">No NDC's available</div>}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
