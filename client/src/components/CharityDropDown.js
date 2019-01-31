import React from "react";
import styled from "styled-components";
import { DrizzleContext } from "drizzle-react";
import { Select } from "rimble-ui";

const StyledSelect = styled(Select)`
  color: #333;
  width: 100%;
`;

const filterActiveCharities = allEvents => {
  const charitiyAddedEvents = allEvents.filter(
    e => e.event === "LogCharityAdded"
  );
  const removedCharities = new Set(
    allEvents.filter(e => e.event === "LogCharityRemoved")
  );

  return charitiyAddedEvents
    .filter(e => !removedCharities.has(e.event))
    .map(c => c.returnValues);
};

const CharityDropDown = ({ charityName, setCharityName }) => {
  return (
    <DrizzleContext.Consumer>
      {drizzleContext => {
        const { drizzleState } = drizzleContext;
        const { Charities } = drizzleState.contracts;

        const activeCharities = filterActiveCharities(Charities.events);

        // Wait for event logs
        if (!activeCharities.length) {
          return null;
        }

        // Set initial state
        if (!charityName) {
          setCharityName(activeCharities[0].name);
        }

        return (
          <StyledSelect
            items={activeCharities.map(e => e.name)}
            value={charityName}
            onChange={e => setCharityName(e.target.value)}
          />
        );
      }}
    </DrizzleContext.Consumer>
  );
};

export default CharityDropDown;
