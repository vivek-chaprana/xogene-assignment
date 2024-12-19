import { useParams } from "react-router";
import { DrugDetails } from "../../components/drug-details";

export function DrugInfoPage() {
  const { rxcui } = useParams<{ rxcui: string }>();
  return (
    <main>
      <DrugDetails rxcui={rxcui} />
    </main>
  );
}
