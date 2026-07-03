import { useState } from "react";
interface ScanState<T> { data: T|null; loading: boolean; error: string|null }
export function useScan<T>(scanFn: (input: string) => Promise<T>) {
  const [state, setState] = useState<ScanState<T>>({ data: null, loading: false, error: null });
  const scan = async (input: string) => {
    setState({ data: null, loading: true, error: null });
    try { setState({ data: await scanFn(input), loading: false, error: null }); }
    catch (e) { setState({ data: null, loading: false, error: (e as Error).message }); }
  };
  return { ...state, scan };
}
