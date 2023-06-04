import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import Search from "./Search";
import Profile from "./Profile";
import "../css/Charts/ShotChart.css";
import { useSelector } from "react-redux";

function ShotCharts() {
  //redux로 shotData 받기
  const shotData = useSelector((state) => state.shotData);
  console.log(shotData);
  const svgRef = useRef();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [playerName, setPlayerName] = useState("");

  const searchPlayer = (e) => {
    e.preventDefault();
    setPlayerName(searchTerm);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const options = {
          method: "GET",
          url: "https://basketapi1.p.rapidapi.com/api/basketball/player/817050/tournament/132/season/38191/shot-actions/playoffs",
          headers: {
            "X-RapidAPI-Key": process.env.REACT_APP_NBA_API_SHOT_KEY,
            "X-RapidAPI-Host": "basketapi1.p.rapidapi.com",
          },
        };

        const response = await axios.request(options);
        console.log(playerName);
        const shooting = shotData
          .filter(
            (shot) =>
              shot.player.first_name + " " + shot.player.last_name ===
              playerName
          )
          .map((shot) => shot.fga);

        setData(response.data.shotActions.slice(0, shooting));

        console.log(response.data.shotActions.slice(0, shooting)); //shotData.fga -> undefined

        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (playerName) {
      fetchData();
    }
  }, [playerName]);

  useEffect(() => {
    // 농구코트 그리기
    const width = 700;
    const usableWidth = Math.min(700, width);
    const margins = 30;
    const height = (usableWidth / 50) * 47;

    // 세로 길이
    const y = d3
      .scaleLinear()
      .range([0, height - margins * 2])
      .domain([0, 47]);

    // 골대
    const basket = y(4);
    const basketRadius = y(4.75) - basket;

    const pi = Math.PI / 180;

    // 가로 길이
    const x = d3
      .scaleLinear()
      .range([0, usableWidth - margins * 2])
      .domain([-25, 25]);

    // arc generator
    const arc = (radius, start, end) => {
      const points = [...Array(30)].map((d, i) => i);

      const angle = d3
        .scaleLinear()
        .domain([0, points.length - 1])
        .range([start, end]);

      const line = d3
        .lineRadial()
        .radius(radius)
        .angle((d, i) => angle(i));

      return line(points);
    };

    // 3점라인 각도
    const threeAngle = (Math.atan((10 - 0.75) / 22) * 180) / Math.PI;

    // svg
    const svg = d3
      .select(svgRef.current)
      .attr("width", usableWidth) // 변경된 가로 크기 적용
      .attr("height", height + margins * 2); // 변경된 세로 크기에 여백도 반영

    // group element
    const g = svg
      .append("g")
      .attr("transform", `translate(${[margins, margins]})`)
      .style("fill", "none")
      .style("stroke", "#000");

    // basket
    g.append("circle")
      .attr("r", basketRadius)
      .attr("cx", x(0))
      .attr("cy", y(4.75));

    // backboard
    g.append("rect")
      .attr("x", x(-3))
      .attr("y", basket)
      .attr("width", x(3) - x(-3))
      .attr("height", 1);

    // outer paint
    g.append("rect")
      .attr("x", x(-8))
      .attr("y", y(0))
      .attr("width", x(8) - x(-8))
      .attr("height", y(15) + basket);

    // inner paint
    g.append("rect")
      .attr("x", x(-6))
      .attr("y", y(0))
      .attr("width", x(6) - x(-6))
      .attr("height", y(15) + basket);

    // 제한 구역
    g.append("path")
      .attr("d", arc(x(4) - x(0), 90 * pi, 270 * pi))
      .attr("transform", `translate(${[x(0), basket]})`);

    // 자유투
    g.append("path")
      .attr("d", arc(x(6) - x(0), 90 * pi, 270 * pi))
      .attr("transform", `translate(${[x(0), y(15) + basket]})`);

    // 자유투 안쪽
    g.append("path")
      .attr("d", arc(x(6) - x(0), -90 * pi, 90 * pi))
      .attr("stroke-dasharray", "3,3")
      .attr("transform", `translate(${[x(0), y(15) + basket]})`);

    // 3점 라인
    g.append("line")
      .attr("x1", x(-21.775)) // lines up the stroke a little better than the true 22 ft.
      .attr("x2", x(-21.775))
      .attr("y2", y(14));

    g.append("line")
      .attr("x1", x(21.775))
      .attr("x2", x(21.775))
      .attr("y2", y(14));

    // 3점 각
    g.append("path")
      .attr("d", arc(y(23.75), (threeAngle + 90) * pi, (270 - threeAngle) * pi))
      .attr("transform", `translate(${[x(0), basket + basketRadius]})`);

    // half court outer
    g.append("path")
      .attr("d", arc(x(6) - x(0), -90 * pi, 90 * pi))
      .attr("transform", `translate(${[x(0), y(47)]})`);

    // half court inner
    g.append("path")
      .attr("d", arc(x(2) - x(0), -90 * pi, 90 * pi))
      .attr("transform", `translate(${[x(0), y(47)]})`);

    // half court line
    g.append("line")
      .attr("x1", x(-25))
      .attr("x2", x(25))
      .attr("y1", y(47))
      .attr("y2", y(47));

    // boundaries
    g.append("rect")
      .style("stroke", "#ddd")
      .attr("x", x(-25))
      .attr("y", y(0))
      .attr("width", x(25))
      .attr("height", y(47));

    // 데이터 조정
    const adjustedData = data.map((d) => ({
      made: d.made,
      missed: d.missed,
      x: Math.random() * 50 - 25, // -25부터 25까지의 랜덤한 숫자
      y: Math.random() * 28 + 1, // 1부터 28까지의 랜덤한 숫자
    }));

    // 점과 툴팁 추가
    g.selectAll("dot")
      .data(adjustedData)
      .enter()
      .append("circle")
      .attr("r", 5) // 점의 반지름 설정
      .attr("cx", (d) => x(d.x)) // x좌표 설정
      .attr("cy", (d) => y(d.y)) // y좌표 설정
      .style("fill", (d) => {
        if (d.made === 1) {
          return "#FFF978"; // 만들어진 경우 노란색
        } else {
          return "#C29F6D"; // 빗나간 경우 갈색
        }
      })

      .on("mouseover", function (d) {
        // 마우스 오버 이벤트 핸들러
        d3.select(this).attr("r", 10); // 점의 크기 변경
        // 툴팁 요소 생성 및 스타일 설정
        d3.select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("position", "fixed")
          .style("background-color", "white")
          .style("border", "3px solid black")
          .style("border-radius", "5px")
          .style("padding", "10px")
          .style("opacity", 0.8)
          .style("right", "450px") // 툴팁의 x좌표 설정
          .style("top", "480px") // 툴팁의 y좌표 설정
          .text(d.made === 1 ? "made" : "missed"); // 툴팁의 내용 설정
      })
      .on("mouseout", function () {
        // 마우스 아웃 이벤트 핸들러
        d3.select(this).attr("r", 5); // 점의 크기 원래대로 복구
        d3.select(".tooltip").remove(); // 툴팁 요소 제거
      });
  }, [data]);

  return (
    <div>
      <div className="shot-charts">
        <div className="except-title">
          <div className="profile-wrapper">
            {/* Profile 컴포넌트에 전달 
            Search에서 찾은거랑 같은거 전달*/}
            {shotData.map((shot) => {
              const name = shot.player.first_name + " " + shot.player.last_name;
              console.log(name);
              if (name === searchTerm) {
                return (
                  <Profile
                    key={shot.id}
                    name={name}
                    stats={[
                      { label: "points_per_game", value: shot.pts },
                      { label: "assists_per_game", value: shot.ast },
                      { label: "blocks_per_game", value: shot.blk },
                      { label: "three_point_percentage", value: shot.fg3_pct },
                      { label: "field_goal_all", value: shot.fga },
                      { label: "field_goal_percentage", value: shot.fg_pct },
                      { label: "rebounds_per_game", value: shot.reb },
                    ]}
                  />
                );
              }
            })}
          </div>
          <div className="other-content">
            {/* Search 컴포넌트로부터 이름을 입력받는 input과 button */}
            <Search
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchPlayer={searchPlayer}
            />
            <h1>{`2022-23 ${playerName} Shot Chart`}</h1>
            {/* SVG와 관련된 코드 */}
            <svg ref={svgRef} width={500} height={500} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShotCharts;
