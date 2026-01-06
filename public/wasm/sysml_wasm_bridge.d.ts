/* tslint:disable */
/* eslint-disable */
/**
 * Initialize panic hook for better error reporting in WASM
 * This should be called when the WASM module is loaded
 */
export function init_panic_hook(): void;
export function slugify(s: string): string;
/**
 * Main SysML Parser and Documentation Provider
 */
export class SysMLWasm {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Generate CST (Concrete Syntax Tree)
   */
  generate_cst(source: string, file_uri: string): any;
  /**
   * Generate HIR (High-level Intermediate Representation)
   */
  generate_hir(source: string, file_uri: string): any;
  /**
   * Run state machine simulation and return execution trace
   * Delegates to sysml-ide-simulation crate for all business logic
   */
  run_simulation(source: string, file_uri: string, max_steps: number): any;
  /**
   * Extract scenarios (use cases) from source
   */
  extract_scenarios(source: string): any;
  /**
   * Evaluate an assertion
   */
  evaluate_assertion(source: string, assertion_id: bigint, context_json: string): any;
  /**
   * Extract assertions from a verification case
   */
  extract_assertions(source: string, verification_id: bigint): any;
  /**
   * Generate analytics and statistics
   */
  generate_analytics(source: string, file_uri: string): any;
  /**
   * Extract requirements traceability matrix with satisfy/verify relationships
   * This uses the proper backend traceability API instead of documentation reconstruction
   */
  extract_traceability(source: string, file_uri: string): any;
  /**
   * Generate trade study analysis with variant extraction and scoring
   * Delegates to sysml-ide-trade-study crate for all business logic
   */
  generate_trade_study(source: string, file_uri: string): any;
  /**
   * Generate documentation from SysML code
   * Uses Salsa queries which automatically trigger HIR lowering via registered HirLowerer
   */
  generate_documentation(source: string, file_uri: string): any;
  /**
   * Calculate test coverage for requirements
   */
  calculate_test_coverage(source: string): any;
  /**
   * Extract succession flows from a verification case
   */
  extract_succession_flows(source: string, verification_id: bigint): any;
  /**
   * Create a new SysML WASM instance
   */
  constructor();
  /**
   * Parse SysML v2 code and return diagnostics
   * Uses the full diagnostics pipeline including syntax, semantic, and style diagnostics
   */
  parse(source: string): any;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_sysmlwasm_free: (a: number, b: number) => void;
  readonly sysmlwasm_calculate_test_coverage: (a: number, b: number, c: number) => [number, number, number];
  readonly sysmlwasm_evaluate_assertion: (a: number, b: number, c: number, d: bigint, e: number, f: number) => [number, number, number];
  readonly sysmlwasm_extract_assertions: (a: number, b: number, c: number, d: bigint) => [number, number, number];
  readonly sysmlwasm_extract_scenarios: (a: number, b: number, c: number) => [number, number, number];
  readonly sysmlwasm_extract_succession_flows: (a: number, b: number, c: number, d: bigint) => [number, number, number];
  readonly sysmlwasm_extract_traceability: (a: number, b: number, c: number, d: number, e: number) => [number, number, number];
  readonly sysmlwasm_generate_analytics: (a: number, b: number, c: number, d: number, e: number) => [number, number, number];
  readonly sysmlwasm_generate_cst: (a: number, b: number, c: number, d: number, e: number) => [number, number, number];
  readonly sysmlwasm_generate_documentation: (a: number, b: number, c: number, d: number, e: number) => [number, number, number];
  readonly sysmlwasm_generate_hir: (a: number, b: number, c: number, d: number, e: number) => [number, number, number];
  readonly sysmlwasm_generate_trade_study: (a: number, b: number, c: number, d: number, e: number) => [number, number, number];
  readonly sysmlwasm_new: () => number;
  readonly sysmlwasm_parse: (a: number, b: number, c: number) => [number, number, number];
  readonly sysmlwasm_run_simulation: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number, number];
  readonly init_panic_hook: () => void;
  readonly slugify: (a: number, b: number) => [number, number];
  readonly __wbindgen_malloc_command_export: (a: number, b: number) => number;
  readonly __wbindgen_realloc_command_export: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_free_command_export: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_3: WebAssembly.Table;
  readonly __externref_table_dealloc_command_export: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
