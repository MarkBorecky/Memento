import { API_BASE_URL } from "../../config";
import {
  BehaviorSubject,
  catchError,
  from,
  Observable,
  of,
  switchMap,
  tap,
} from "rxjs";

export interface Course {
  id: number;
  name: string;
}

export const manageState =
  <T>(
    setLoading: (isLoading: boolean) => void,
    setData: (data: T) => void,
    setError: (error: string) => void,
  ): ((result: Result<T>) => void) =>
  (result) => {
    setLoading(result.status === "LOADING");

    if (result.status === FetchingStatus.ERROR) {
      const error = result as Error<T>;
      setError(error.errorMessage);
    }

    if (result.status === FetchingStatus.SUCCESS) {
      const data = result as Success<T>;
      setData(data.data);
    }
  };

const RESOURCES_PATH = "/courses";

export enum FetchingStatus {
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

export interface Result<T> {
  status: FetchingStatus;
}

export interface Success<T> extends Result<T> {
  data: T;
}

export interface Error<T> extends Result<T> {
  errorMessage: string;
}

const NetworkError = {
  status: FetchingStatus.ERROR,
  errorMessage: "Network response was not ok",
};

async function success<T>(response: T) {
  return { status: FetchingStatus.SUCCESS, data: response };
}

const createError = (error: any): Error<Course[]> => ({
  status: FetchingStatus.ERROR,
  errorMessage: error.message,
});

export class CoursesProvider {
  private readonly data: BehaviorSubject<Result<Course[]>>;

  constructor() {
    const loading: Result<Course[]> = { status: FetchingStatus.LOADING };
    this.data = new BehaviorSubject(loading);
    this.fetchData();
  }

  public getData(): Observable<Result<Course[]>> {
    return this.data.asObservable();
  }

  private fetchData() {
    from(fetch(`${API_BASE_URL}${RESOURCES_PATH}`))
      .pipe(
        tap((response: Response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
        }),
        switchMap(async (response: Response) => {
          const courses = await response.json();
          return success(courses);
        }),
        catchError((error) => of(createError(error))),
      )
      .subscribe((result) => this.data.next(result));
  }
}
