import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import Search from "./Search";
import Profile from "./Profile";
import "../css/Charts/ShotChart.css";

function ShotCharts() {
  const svgRef = useRef();
  const [data, setData] = useState([]);

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
        setData(response.data.shotActions.slice(0, 40));
        console.log(response.data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

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
      .attr("width", usableWidth) // ����� ���� ũ�� ����
      .attr("height", height + margins * 2); // ����� ���� ũ�⿡ ���鵵 �ݿ�

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

    // ������ ����
    const adjustedData = data.map((d) => ({
      made: d.made,
      missed: d.missed,
      x: Math.random() * 50 - 25, // -25���� 25������ ������ ����
      y: Math.random() * 28 + 1, // 1���� 28������ ������ ����
    }));

    // ���� ���� �߰�
    g.selectAll("dot")
      .data(adjustedData)
      .enter()
      .append("circle")
      .attr("r", 5) // ���� ������ ����
      .attr("cx", (d) => x(d.x)) // x��ǥ ����
      .attr("cy", (d) => y(d.y)) // y��ǥ ����
      .style("fill", (d) => {
        if (d.made === 1) {
          return "#FFF978"; // ������� ��� �Ķ���
        } else {
          return "#C29F6D"; // ������ ��� ������
        }
      })
      .on("mouseover", function (d) {
        // ���콺 ���� �̺�Ʈ �ڵ鷯
        d3.select(this).attr("r", 10); // ���� ũ�� ����
        // ���� ��� ���� �� ��Ÿ�� ����
        d3.select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("position", "fixed")
          .style("background-color", "white")
          .style("border", "3px solid black")
          .style("border-radius", "5px")
          .style("padding", "10px")
          .style("opacity", 0.8)
          .style("right", "450px") // ������ x��ǥ ����
          .style("top", "480px") // ������ y��ǥ ����
          .text(d.made === 1 ? "made" : "missed"); // ������ ���� ����
      })
      .on("mouseout", function () {
        // ���콺 �ƿ� �̺�Ʈ �ڵ鷯
        d3.select(this).attr("r", 5); // ���� ũ�� ������� ����
        d3.select(".tooltip").remove(); // ���� ��� ����
      });
  }, [data]);

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
