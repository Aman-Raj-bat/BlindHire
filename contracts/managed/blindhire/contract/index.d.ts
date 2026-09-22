import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  candidate_credentials(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, { degree_code: bigint,
                                                                                      gpa_scaled: bigint,
                                                                                      experience_months: bigint,
                                                                                      certification_code: bigint,
                                                                                      candidate_id: Uint8Array
                                                                                    }];
  recruiter_secret_key(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  prove_qualification(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  update_job_requirements(context: __compactRuntime.CircuitContext<PS>,
                          new_min_gpa_0: bigint,
                          new_min_experience_months_0: bigint,
                          new_degree_code_0: bigint,
                          new_cert_code_0: bigint,
                          new_deadline_0: bigint,
                          new_max_applicants_0: bigint,
                          new_active_status_0: boolean): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  prove_qualification(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  update_job_requirements(context: __compactRuntime.CircuitContext<PS>,
                          new_min_gpa_0: bigint,
                          new_min_experience_months_0: bigint,
                          new_degree_code_0: bigint,
                          new_cert_code_0: bigint,
                          new_deadline_0: bigint,
                          new_max_applicants_0: bigint,
                          new_active_status_0: boolean): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
  recruiterPublicKey(sk_0: Uint8Array): Uint8Array;
  makeNullifier(candidate_id_0: Uint8Array): Uint8Array;
  makeQualificationReceipt(nullifier_0: Uint8Array): Uint8Array;
}

export type Circuits<PS> = {
  prove_qualification(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  update_job_requirements(context: __compactRuntime.CircuitContext<PS>,
                          new_min_gpa_0: bigint,
                          new_min_experience_months_0: bigint,
                          new_degree_code_0: bigint,
                          new_cert_code_0: bigint,
                          new_deadline_0: bigint,
                          new_max_applicants_0: bigint,
                          new_active_status_0: boolean): __compactRuntime.CircuitResults<PS, []>;
  recruiterPublicKey(context: __compactRuntime.CircuitContext<PS>,
                     sk_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  makeNullifier(context: __compactRuntime.CircuitContext<PS>,
                candidate_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  makeQualificationReceipt(context: __compactRuntime.CircuitContext<PS>,
                           nullifier_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
}

export type Ledger = {
  readonly min_gpa: bigint;
  readonly min_experience_months: bigint;
  readonly required_degree_code: bigint;
  readonly required_certification_code: bigint;
  readonly recruiter: Uint8Array;
  readonly application_deadline: bigint;
  readonly is_active: boolean;
  readonly max_applicants: bigint;
  readonly qualified_count: bigint;
  nullifiers: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  qualification_commitments: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>,
               initial_min_gpa_0: bigint,
               initial_min_experience_months_0: bigint,
               initial_degree_code_0: bigint,
               initial_cert_code_0: bigint,
               recruiter_admin_hash_0: Uint8Array,
               deadline_0: bigint,
               applicant_limit_0: bigint): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
