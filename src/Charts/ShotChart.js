import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

import Search from "./Search";
import Profile from "./Profile";
import "../css/Charts/ShotChart.css";

function ShotCharts() {
  const svgRef = useRef();

  useEffect(() => {
    // constants
    const width = 700;
    const usableWidth = Math.min(700, width);
    const margins = 30;
    const height = (usableWidth / 50) * 47;

    // scales y
    const y = d3
      .scaleLinear()
      .range([0, height - margins * 2])
      .domain([0, 47]);

    // constants basket
    const basket = y(4);
    const basketRadius = y(4.75) - basket;

    const pi = Math.PI / 180;

    // scales x
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

    // angle for the three point line
    const threeAngle = (Math.atan((10 - 0.75) / 22) * 180) / Math.PI;

    // select the svg element
    const svg = d3
      .select(svgRef.current)
      .attr("width", usableWidth) // 변경된 가로 크기 적용
      .attr("height", height + margins * 2); // 변경된 세로 크기에 여백도 반영

    // append a group element
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

    // restricted area
    g.append("path")
      .attr("d", arc(x(4) - x(0), 90 * pi, 270 * pi))
      .attr("transform", `translate(${[x(0), basket]})`);

    // freethrow
    g.append("path")
      .attr("d", arc(x(6) - x(0), 90 * pi, 270 * pi))
      .attr("transform", `translate(${[x(0), y(15) + basket]})`);

    // freethrow dotted
    g.append("path")
      .attr("d", arc(x(6) - x(0), -90 * pi, 90 * pi))
      .attr("stroke-dasharray", "3,3")
      .attr("transform", `translate(${[x(0), y(15) + basket]})`);

    // 3-point lines
    g.append("line")
      .attr("x1", x(-21.775)) // lines up the stroke a little better than the true 22 ft.
      .attr("x2", x(-21.775))
      .attr("y2", y(14));

    g.append("line")
      .attr("x1", x(21.775))
      .attr("x2", x(21.775))
      .attr("y2", y(14));

    // 3-point arc
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

    // 데이터 준비
    const data = [];
    const numDataPoints = 50;

    for (let i = 0; i < numDataPoints; i++) {
      const x = Math.floor(Math.random() * 47) - 23;
      const y = Math.floor(Math.random() * 31);
      const per = Math.floor(Math.random() * 51) + 30 + "%";

      data.push({ x, y, per });
    }

    // 점과 툴팁 추가
    g.selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 5) // 점의 반지름 설정
      .attr("cx", (d) => x(d.x)) // x좌표 설정
      .attr("cy", (d) => y(d.y)) // y좌표 설정
      .style("fill", (d) => {
        if (parseFloat(d.per) >= 50) {
          return "#ff451c";
        } else {
          return "#4c566a"; // 원하는 다른 색상으로 변경하세요.
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

          .text(d.per); // 툴팁의 내용 설정
      })
      .on("mouseout", function (d) {
        // 마우스 아웃 이벤트 핸들러
        d3.select(this).attr("r", 5); // 점의 크기 원래대로 복구
        d3.select(".tooltip").remove(); // 툴팁 요소 제거
      });
  }, []);

  return (
    <div>
      <div className="shot-charts">
        <Search />
        <h1>2022-23 Lebron James</h1>

        <div className="except-title">
          <div className="profile-wrapper">
            <Profile />
          </div>
          <div className="other-content">
            <svg ref={svgRef} width={500} height={500} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShotCharts;
