(function () {
  const data = window.MEDI_HOSPITAL_DATA;
  const { floors, translations } = data;
  const pageRoot = document.querySelector(".indoor-page");
  const elements = {
    language: document.getElementById("languageSelect"),
    floor: document.getElementById("floorSelect"),
    searchForm: document.getElementById("searchForm"),
    search: document.getElementById("destinationSearch"),
    searchResults: document.getElementById("searchResults"),
    searchMessage: document.getElementById("searchMessage"),
    map: document.getElementById("floorMap"),
    floorHeading: document.getElementById("floorHeading"),
    mapStatus: document.getElementById("mapStatus"),
    routeSummary: document.getElementById("routeSummary"),
    routeSteps: document.getElementById("routeSteps"),
    continueButton: document.getElementById("continueRoute"),
    routeNotice: document.getElementById("routeNotice"),
    startPoint: document.getElementById("startPointName"),
  };
  const svgNamespace = "http://www.w3.org/2000/svg";
  const state = {
    language: "en",
    floorId: "ground",
    destination: null,
    route: null,
    timer: null,
  };

  function translate(key) {
    return translations[state.language][key] || key;
  }

  function format(key, values) {
    return Object.keys(values).reduce(
      (text, name) => text.replace(`{${name}}`, values[name]),
      translate(key),
    );
  }

  function localizedName(item) {
    return item.names[state.language];
  }

  function allDestinations() {
    return Object.values(floors).flatMap((floor) => [
      ...floor.rooms.map((item) => ({ ...item, floorId: floor.id })),
      ...floor.facilities.map((item) => ({ ...item, floorId: floor.id })),
    ]);
  }

  function getFloorName(floorId) {
    const floor = floors[floorId];
    const english = translations.en[floor.titleKey];
    const tamil = translations.ta[floor.titleKey];
    return state.language === "ta"
      ? `${tamil} — ${english}`
      : `${english} — ${tamil}`;
  }

  function cancelAnimation() {
    if (state.timer !== null) {
      window.clearInterval(state.timer);
      state.timer = null;
    }
  }

  function clearRoute() {
    cancelAnimation();
    state.route = null;
    state.destination = null;
    elements.routeSteps.replaceChildren();
    elements.routeNotice.textContent = "";
    elements.continueButton.hidden = true;
    elements.mapStatus.classList.remove("is-routing");
    elements.mapStatus.textContent = translate("mapReady");
    elements.routeSummary.textContent = translate("routePrompt");
  }

  function applyLanguage() {
    pageRoot.lang = state.language;
    if (pageRoot === document.body) {
      document.documentElement.lang = state.language;
      document.title = translate("browserTitle");
    }
    pageRoot.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = translate(element.dataset.i18n);
    });
    elements.search.placeholder = translate("searchPlaceholder");
    elements.language.setAttribute("aria-label", translate("languageLabel"));
    Array.from(elements.floor.options).forEach((option) => {
      option.textContent = getFloorName(option.value);
    });
    elements.floorHeading.textContent = getFloorName(state.floorId);
    elements.startPoint.textContent = translate(
      state.floorId === "ground" ? "startEntrance" : "startElevator",
    );
    if (state.route) {
      renderRouteDetails();
      renderMap();
    } else {
      elements.routeSummary.textContent = translate("routePrompt");
      elements.mapStatus.textContent = translate("mapReady");
      renderMap();
    }
  }

  function svgElement(tag, attributes, text) {
    const element = document.createElementNS(svgNamespace, tag);
    Object.entries(attributes || {}).forEach(([name, value]) => {
      element.setAttribute(name, value);
    });
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function wrapWords(value, limit) {
    const words = value.split(/\s+/);
    const lines = [];
    let line = "";
    words.forEach((word) => {
      const candidate = line ? `${line} ${word}` : word;
      if (candidate.length > limit && line) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    });
    if (line) lines.push(line);
    return lines;
  }

  function addWrappedText(parent, text, x, y, className, limit, lineHeight) {
    const element = svgElement("text", { x, y, class: className });
    wrapWords(text, limit).forEach((line, index) => {
      element.appendChild(
        svgElement(
          "tspan",
          {
            x,
            dy: index === 0 ? 0 : lineHeight,
          },
          line,
        ),
      );
    });
    parent.appendChild(element);
    return element;
  }

  function roomByNode(floor, nodeId) {
    return floor.rooms.find((item) => item.node === nodeId);
  }

  function facilityByNode(floor, nodeId) {
    return floor.facilities.find((item) => item.node === nodeId);
  }

  function drawCorridors(floor, group) {
    floor.edges.forEach(([fromId, toId]) => {
      const from = floor.nodes[fromId];
      const to = floor.nodes[toId];
      group.appendChild(
        svgElement("line", {
          x1: from.x,
          y1: from.y,
          x2: to.x,
          y2: to.y,
          class: "corridor-edge",
        }),
      );
      group.appendChild(
        svgElement("line", {
          x1: from.x,
          y1: from.y,
          x2: to.x,
          y2: to.y,
          class: "corridor-centerline",
        }),
      );
    });
  }

  function startRouteFor(item) {
    clearRoute();
    elements.searchResults.hidden = true;
    elements.searchResults.replaceChildren();
    elements.searchMessage.textContent = "";
    state.destination = item;
    state.floorId = elements.floor.value;
    elements.floorHeading.textContent = getFloorName(state.floorId);
    elements.startPoint.textContent = translate(
      state.floorId === "ground" ? "startEntrance" : "startElevator",
    );

    const currentFloor = floors[state.floorId];
    const startNode = currentFloor.entrance;
    const crossesFloor = state.floorId !== item.floorId;
    const goalNode = crossesFloor ? "elevator" : item.node;
    const path = findPath(currentFloor, startNode, goalNode);

    if (!path) {
      state.destination = null;
      elements.searchMessage.textContent = translate("noResults");
      elements.searchMessage.classList.add("is-error");
      return;
    }

    state.route = {
      phase: crossesFloor ? "transfer" : "direct",
      floorId: state.floorId,
      targetFloorId: item.floorId,
      path,
      stepIndex: 0,
    };
    renderRouteDetails();
    renderMap();
    animateRoute();
  }

  function drawRoom(floor, room, group) {
    const shape = svgElement("g", {
      class: `map-room room-${room.category}${isSelected(room) ? " is-selected" : ""}`,
      tabindex: "0",
      role: "button",
      "aria-label": `${room.number}, ${room.names.en}, ${room.names.ta}, ${getFloorName(floor.id)}`,
    });
    shape.dataset.destinationId = room.id;
    const { x, y, width, height } = room.rect;
    shape.appendChild(
      svgElement("rect", {
        x,
        y,
        width,
        height,
        rx: 10,
        class: "room-rect",
      }),
    );
    shape.appendChild(
      svgElement(
        "text",
        {
          x: x + width / 2,
          y: y + 24,
          class: "room-number",
        },
        room.number,
      ),
    );
    addWrappedText(
      shape,
      room.names.en,
      x + width / 2,
      y + 48,
      "room-label-en",
      23,
      15,
    );
    addWrappedText(
      shape,
      room.names.ta,
      x + width / 2,
      y + 79,
      "room-label-ta",
      19,
      15,
    );
    shape.addEventListener("click", () =>
      startRouteFor({ ...room, floorId: floor.id }),
    );
    shape.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        startRouteFor({ ...room, floorId: floor.id });
      }
    });
    group.appendChild(shape);
  }

  function isSelected(item) {
    return Boolean(
      state.destination &&
        state.destination.id === item.id &&
        state.destination.floorId === state.floorId,
    );
  }

  function drawFacility(floor, facility, group) {
    const point = floor.nodes[facility.node];
    const name = localizedName(facility);
    const label = `${name} — ${facility.names[state.language === "en" ? "ta" : "en"]}`;
    const width = Math.min(190, Math.max(110, label.length * 8));
    const isDestination =
      state.destination &&
      state.destination.id === facility.id &&
      state.destination.floorId === floor.id;
    const isTransferStop =
      state.route &&
      state.route.phase === "transfer" &&
      state.route.floorId === floor.id &&
      facility.node === "elevator";
    const marker = svgElement("g", {
      class: `facility-marker${isDestination ? " is-selected" : ""}${isTransferStop ? " is-transfer-stop" : ""}`,
      tabindex: "0",
      role: "button",
      "aria-label": `${facility.names.en}, ${facility.names.ta}`,
    });
    marker.appendChild(
      svgElement("rect", {
        x: point.x - width / 2,
        y: point.y - 18,
        width,
        height: 36,
        rx: 9,
      }),
    );
    marker.appendChild(
      svgElement(
        "text",
        {
          x: point.x,
          y: point.y + 5,
        },
        name,
      ),
    );
    marker.addEventListener("click", () =>
      startRouteFor({ ...facility, floorId: floor.id }),
    );
    marker.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        startRouteFor({ ...facility, floorId: floor.id });
      }
    });
    group.appendChild(marker);
  }

  function drawEntrance(floor, group) {
    if (floor.id !== "ground") return;
    const point = floor.nodes.entranceApproach;
    const isSelected =
      state.destination &&
      state.destination.id === "main-entrance" &&
      state.destination.floorId === floor.id;
    const marker = svgElement("g", {
      class: `entrance-marker${isSelected ? " is-selected" : ""}`,
    });
    marker.appendChild(
      svgElement("circle", { cx: point.x, cy: point.y, r: 11 }),
    );
    marker.appendChild(
      svgElement(
        "text",
        {
          x: point.x,
          y: point.y + 29,
        },
        localizedName(floor.rooms.find((item) => item.id === "main-entrance")),
      ),
    );
    group.appendChild(marker);
  }

  function drawRoute(floor, group) {
    if (!state.route || state.route.floorId !== floor.id) return;
    const points = state.route.path.map((nodeId) => {
      const point = floor.nodes[nodeId];
      return `${point.x},${point.y}`;
    });
    const routeId = "active-route-line";
    if (points.length > 1) {
      group.appendChild(
        svgElement("polyline", {
          id: routeId,
          points: points.join(" "),
          class: "route-line",
        }),
      );
    }
    const currentPoint = floor.nodes[state.route.path[state.route.stepIndex]];
    if (
      state.route.phase === "direct" &&
      state.route.stepIndex === state.route.path.length - 1
    ) {
      group.appendChild(
        svgElement("circle", {
          cx: currentPoint.x,
          cy: currentPoint.y,
          r: 12,
          class: "route-destination",
        }),
      );
    } else {
      group.appendChild(
        svgElement("circle", {
          cx: currentPoint.x,
          cy: currentPoint.y,
          r: 10,
          class: "route-marker",
        }),
      );
    }
  }

  function renderMap() {
    const floor = floors[state.floorId];
    elements.map.replaceChildren();
    elements.map.appendChild(
      svgElement("title", { id: "mapSvgTitle" }, getFloorName(floor.id)),
    );
    elements.map.appendChild(
      svgElement(
        "desc",
        { id: "mapSvgDescription" },
        state.language === "en"
          ? "Demonstration floor plan with connected corridors, rooms, and a highlighted walking route."
          : "இணைக்கப்பட்ட வழித்தடங்கள், அறைகள் மற்றும் வழிகாட்டப்பட்ட பாதையுடன் கூடிய மாதிரி தள வரைபடம்.",
      ),
    );
    elements.map.appendChild(
      svgElement("rect", {
        x: 0,
        y: 0,
        width: 1000,
        height: 620,
        class: "floor-background",
      }),
    );

    const corridors = svgElement("g", { "aria-hidden": "true" });
    drawCorridors(floor, corridors);
    elements.map.appendChild(corridors);

    const roomsGroup = svgElement("g", {});
    floor.rooms.forEach((room) => drawRoom(floor, room, roomsGroup));
    elements.map.appendChild(roomsGroup);

    const facilitiesGroup = svgElement("g", {});
    floor.facilities.forEach((facility) =>
      drawFacility(floor, facility, facilitiesGroup),
    );
    elements.map.appendChild(facilitiesGroup);

    const entranceGroup = svgElement("g", { "aria-hidden": "true" });
    drawEntrance(floor, entranceGroup);
    elements.map.appendChild(entranceGroup);

    const routeGroup = svgElement("g", { "aria-hidden": "true" });
    drawRoute(floor, routeGroup);
    elements.map.appendChild(routeGroup);
  }

  function findPath(floor, startId, targetId) {
    const adjacency = new Map();
    floor.edges.forEach(([from, to]) => {
      if (!adjacency.has(from)) adjacency.set(from, []);
      if (!adjacency.has(to)) adjacency.set(to, []);
      adjacency.get(from).push(to);
      adjacency.get(to).push(from);
    });

    if (!floor.nodes[startId] || !floor.nodes[targetId]) return null;
    const queue = [startId];
    const previous = new Map([[startId, null]]);

    for (let index = 0; index < queue.length; index += 1) {
      const node = queue[index];
      if (node === targetId) break;
      (adjacency.get(node) || []).forEach((neighbor) => {
        if (previous.has(neighbor)) return;
        previous.set(neighbor, node);
        queue.push(neighbor);
      });
    }

    if (!previous.has(targetId)) return null;
    const path = [];
    for (let node = targetId; node !== null; node = previous.get(node)) {
      path.unshift(node);
    }
    return path;
  }

  function checkpointName(floor, nodeId) {
    const room = roomByNode(floor, nodeId);
    if (room) return localizedName(room);
    const facility = facilityByNode(floor, nodeId);
    if (facility) return localizedName(facility);
    if (nodeId === "entranceApproach") return translate("startEntrance");
    return state.language === "en"
      ? "the next corridor junction"
      : "அடுத்த வழித்தடச் சந்திப்பு";
  }

  function renderRouteDetails() {
    const route = state.route;
    if (!route) return;
    const destination = localizedName(state.destination);
    const targetFloorName = getFloorName(route.targetFloorId);
    const routeFinished = route.stepIndex >= route.path.length - 1;
    elements.routeSteps.replaceChildren();
    elements.routeNotice.textContent =
      route.phase === "transfer" && !routeFinished
        ? translate("goToElevator")
        : "";
    elements.continueButton.hidden = true;
    elements.mapStatus.classList.toggle("is-routing", !routeFinished);
    elements.mapStatus.textContent = routeFinished
      ? translate(
          route.phase === "transfer" ? "elevatorStatus" : "arrivedStatus",
        )
      : translate("routeStarted");

    if (route.phase === "transfer") {
      elements.routeSummary.textContent = `${translate("goToElevator")} ${format(
        "floorRoute",
        {
          floor: targetFloorName,
          destination,
        },
      )}`;
    } else {
      const start = translate(
        route.floorId === "ground" ? "startEntrance" : "startElevator",
      );
      elements.routeSummary.textContent = `${translate("sameFloorStart")}: ${start} · ${translate("routeTo")}: ${destination}`;
    }

    route.path.slice(1).forEach((nodeId, index) => {
      const item = document.createElement("li");
      item.textContent = format("step", {
        number: String(index + 1),
        checkpoint: checkpointName(floors[route.floorId], nodeId),
      });
      if (index < route.stepIndex) item.classList.add("is-done");
      if (index === route.stepIndex) item.classList.add("is-active");
      elements.routeSteps.appendChild(item);
    });

    if (
      route.phase === "transfer" &&
      route.stepIndex >= route.path.length - 1
    ) {
      elements.routeNotice.textContent = translate("transferReady");
      elements.continueButton.textContent = `${translate("continueTo")} ${targetFloorName}`;
      elements.continueButton.hidden = false;
    } else if (
      route.phase === "direct" &&
      route.stepIndex >= route.path.length - 1
    ) {
      elements.routeNotice.textContent = format("reached", { destination });
    }
  }

  function animateRoute() {
    cancelAnimation();
    if (!state.route) return;

    if (state.route.path.length <= 1) {
      renderRouteDetails();
      renderMap();
      return;
    }

    state.timer = window.setInterval(() => {
      if (!state.route) {
        cancelAnimation();
        return;
      }
      state.route.stepIndex += 1;
      if (state.route.stepIndex >= state.route.path.length - 1) {
        state.route.stepIndex = state.route.path.length - 1;
        cancelAnimation();
      }
      renderRouteDetails();
      renderMap();
    }, 700);
  }

  function beginDestinationFloorRoute() {
    cancelAnimation();
    const route = state.route;
    if (!route || route.phase !== "transfer") return;
    state.floorId = route.targetFloorId;
    elements.floor.value = state.floorId;
    elements.floorHeading.textContent = getFloorName(state.floorId);
    elements.startPoint.textContent = translate("startElevator");
    const floor = floors[state.floorId];
    const path = findPath(floor, "elevator", state.destination.node);
    if (!path) {
      elements.routeNotice.textContent = translate("noResults");
      return;
    }
    state.route = {
      phase: "direct",
      floorId: state.floorId,
      targetFloorId: state.floorId,
      path,
      stepIndex: 0,
    };
    renderRouteDetails();
    renderMap();
    animateRoute();
  }

  function searchDestinations(query) {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return [];
    return allDestinations().filter((item) => {
      const floor = floors[item.floorId];
      const fields = [
        item.number || "",
        item.names.en,
        item.names.ta,
        translations.en[floor.titleKey],
        translations.ta[floor.titleKey],
      ];
      return fields.some((value) =>
        value.toLocaleLowerCase().includes(normalized),
      );
    });
  }

  function showSearchResults(results) {
    elements.searchResults.replaceChildren();
    results.forEach((item) => {
      const button = document.createElement("button");
      button.className = "search-result";
      button.type = "button";
      button.setAttribute("role", "option");
      button.setAttribute(
        "aria-label",
        `${localizedName(item)}, ${getFloorName(item.floorId)}`,
      );
      const name = document.createElement("span");
      name.textContent = `${item.number ? `${item.number} · ` : ""}${localizedName(item)}`;
      const floor = document.createElement("small");
      floor.textContent = getFloorName(item.floorId);
      button.append(name, floor);
      button.addEventListener("click", () => {
        elements.search.value = localizedName(item);
        startRouteFor(item);
      });
      button.addEventListener("keydown", (event) => {
        const options = Array.from(
          elements.searchResults.querySelectorAll(".search-result"),
        );
        const index = options.indexOf(button);
        if (event.key === "ArrowDown" && options[index + 1]) {
          event.preventDefault();
          options[index + 1].focus();
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          if (options[index - 1]) {
            options[index - 1].focus();
          } else {
            elements.search.focus();
          }
        } else if (event.key === "Escape") {
          hideSearchResults();
          elements.search.focus();
        }
      });
      elements.searchResults.appendChild(button);
    });
    elements.searchResults.hidden = false;
    elements.search.setAttribute("aria-expanded", "true");
  }

  function hideSearchResults() {
    elements.searchResults.hidden = true;
    elements.search.setAttribute("aria-expanded", "false");
  }

  elements.search.addEventListener("input", () => {
    elements.searchMessage.textContent = "";
    elements.searchMessage.classList.remove("is-error");
    const query = elements.search.value.trim();
    if (!query) {
      elements.searchResults.replaceChildren();
      hideSearchResults();
      return;
    }

    const results = searchDestinations(query);
    if (results.length) {
      showSearchResults(results);
    } else {
      elements.searchResults.replaceChildren();
      hideSearchResults();
    }
  });

  elements.search.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" && !elements.searchResults.hidden) {
      event.preventDefault();
      elements.searchResults.querySelector(".search-result")?.focus();
    } else if (event.key === "Escape") {
      hideSearchResults();
    }
  });

  elements.searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    elements.searchMessage.classList.remove("is-error");
    const query = elements.search.value.trim();
    if (!query) {
      hideSearchResults();
      elements.searchMessage.textContent = translate("noQuery");
      elements.searchMessage.classList.add("is-error");
      return;
    }

    const results = searchDestinations(query);
    if (!results.length) {
      hideSearchResults();
      elements.searchMessage.textContent = translate("noResults");
      elements.searchMessage.classList.add("is-error");
      return;
    }
    elements.searchMessage.textContent = "";
    if (results.length === 1) {
      startRouteFor(results[0]);
      return;
    }
    const exact = results.find((item) =>
      [item.number, item.names.en, item.names.ta]
        .filter(Boolean)
        .some((name) => name.toLocaleLowerCase() === query.toLocaleLowerCase()),
    );
    if (exact) {
      startRouteFor(exact);
      return;
    }
    elements.searchMessage.textContent = translate("multipleResults");
    showSearchResults(results);
  });

  elements.floor.addEventListener("change", () => {
    clearRoute();
    hideSearchResults();
    state.floorId = elements.floor.value;
    elements.floorHeading.textContent = getFloorName(state.floorId);
    elements.startPoint.textContent = translate(
      state.floorId === "ground" ? "startEntrance" : "startElevator",
    );
    renderMap();
  });

  elements.language.addEventListener("change", () => {
    state.language = elements.language.value;
    elements.searchMessage.classList.remove("is-error");
    applyLanguage();
    if (elements.search.value.trim()) {
      const results = searchDestinations(elements.search.value);
      if (results.length) {
        showSearchResults(results);
      } else {
        elements.searchResults.replaceChildren();
        hideSearchResults();
      }
    }
  });

  elements.continueButton.addEventListener("click", beginDestinationFloorRoute);
  document
    .querySelectorAll('a[href="#hospital-navigation"]')
    .forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}#hospital-navigation`,
        );
        pageRoot.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
          block: "start",
        });
      });
    });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".destination-search")) {
      hideSearchResults();
    }
  });

  elements.floor.value = state.floorId;
  applyLanguage();
})();
