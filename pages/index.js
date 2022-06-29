import { useState, useEffect } from "react";

export default function Home({ arkInfo }) {
  const [serverInfo, setServerInfo] = useState(arkInfo);

  useEffect(() => {
    let id = setInterval(async () => {
      const res = await fetch(
        `/api/arkInfo?host=${process.env.NEXT_PUBLIC_GAME_HOST}&type=${process.env.NEXT_PUBLIC_GAME_TYPE}`
      );
      const data = await res.json();
      setServerInfo(data);
    }, 15000);
    return () => clearInterval(id)
  }, []);

  function formatSecend(secend) {
    if (!secend) return "時間載入中...";
    let remain = secend;

    let h = 0;
    let m = 0;
    let s = 0;

    h = Math.floor(remain / (60 * 60));

    remain = remain % (60 * 60);

    m = Math.floor(remain / 60);

    s = Math.floor(remain % 60);

    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <div className="container py-5">
      <h1 className="h1">
        Game: {serverInfo ? serverInfo.raw.game : "Unknown Server"}
      </h1>
      {!serverInfo && (
        <div className="d-flex align-items-center">
          <div>
            <h6 className="m-0">伺服器狀態: </h6>
          </div>

          <div
            style={{ height: "4px", width: "4px" }}
            className={"mx-2 p-2 border border-light rounded-circle bg-danger"}
          >
            {/* success, danger */}
            <span className="visually-hidden">Disconnected</span>
          </div>
        </div>
      )}
      {serverInfo && (
        <>
          <h1 className="h2">
            Server: {serverInfo.name}, Map: {serverInfo.map}
          </h1>
          <div className="d-flex align-items-center mt-4">
            <div className="d-flex">
              <h6 className="m-0">伺服器狀態: </h6>
              <div
                style={{ height: "4px", width: "4px" }}
                className={
                  "mx-2 p-2 border border-light rounded-circle bg-success"
                }
              >
                {/* success, danger */}
                <span className="visually-hidden">Connected</span>
              </div>
            </div>

            {/* <div className="">
              <h6 className="m-0">Ping: {serverInfo.ping}</h6>
            </div> */}
          </div>

          <div className="my-3 p-3 bg-body rounded shadow-sm">
            <h6 className="border-bottom pb-2 mb-0">
              線上玩家: {serverInfo.raw.numplayers} / {serverInfo.maxplayers}
            </h6>
            {serverInfo.players.map((player, index) => {
              return (
                <div className="d-flex text-muted pt-3" key={index}>
                  <svg
                    className="bd-placeholder-img flex-shrink-0 me-2 rounded"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    width="32"
                    height="32"
                  >
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                  </svg>
                  <p className="mb-0 small lh-sm">
                    <strong className="d-block text-gray-dark">
                      @ {player.name ? player.name : "名稱載入中..."}
                    </strong>
                    在線時間: {formatSecend(player.raw.time)}
                    {/* Some representative placeholder content, with some information
                about this user. Imagine this being some sort of status update,
                perhaps? */}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  console.log(process.env);
  // Fetch data from external API
  const res = await fetch(
    `http://localhost:${process.env.PORT}/api/arkInfo?host=${process.env.NEXT_PUBLIC_GAME_HOST}&type=${process.env.NEXT_PUBLIC_GAME_TYPE}`
  );
  const data = await res.json();

  // Pass data to the page via props
  return { props: { arkInfo: data } };
}
