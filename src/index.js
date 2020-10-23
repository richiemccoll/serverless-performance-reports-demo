import React from "react";
import ReactDOM from "react-dom";
import ReportViewer from "react-lighthouse-viewer";

import useAsync from "./hooks/use-async";

const DATE_REGEX = /(report-([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])))/;

function parseQueryString(searchParam) {
  if (!DATE_REGEX.test(searchParam)) {
    const today = new Date();
    const [date] = today.toISOString().split('T');
    return `report-${date}.json`;
  }

  return `${searchParam.replace('?', '')}.json`;
}


const STORAGE_URL = '<YOUR S3 URL HERE>';

function App() {
  const queryString = parseQueryString(window.location.search);
  const { data, status, error, run } = useAsync({
    status: queryString ? "pending" : "idle",
  });

  React.useEffect(() => {
    if (!queryString) {
      return;
    }
    const url = `${STORAGE_URL}/${queryString}`;
    run(fetch(url).then(res => res.json()));
  }, [queryString, run]);

  return (
    <main>
      {status === 'pending' && <span>Loading...</span>}
      {data && <ReportViewer json={data} />}
      {error && <span>Oops, something went wrong</span>}
    </main>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));