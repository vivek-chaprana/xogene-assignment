export type TTY = string;

export interface DrugSearchResponse {
  drugGroup: {
    name: null;
    conceptGroup:
      | [
          {
            tty: TTY;
            conceptProperties: DrugConceptProperty[];
          }
        ]
      | undefined;
  };
}

export interface DrugConceptProperty {
  tty: TTY;
  rxcui: string;
  name: string;
  synonym: string;
  language: string;
  suppress: string;
  umlscui: string;
}

export interface DrugSuggestionResponse {
  suggestionGroup: {
    name: null;
    suggestionList: {
      suggestion?: string[];
    };
  };
}

export interface DrugPropResponse {
  properties?: DrugConceptProperty;
}

export interface DrugNdcsResponse {
  ndcGroup: {
    rxcui: null;
    ndcList: {
      ndc?: string[];
    };
  };
}
