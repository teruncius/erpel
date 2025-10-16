import { useCallback } from "react";
import { useNavigate } from "react-router";
import { styled } from "styled-components";

import { Icon } from "@erpel/ui/components/icon";
import { useStore } from "@erpel/ui/store/store";

export function Actions() {
    const navigate = useNavigate();
    const { isOpen, toggle } = useStore();

    const handleNavigateSettings = useCallback(() => {
        navigate("/settings");
    }, [navigate]);

    const handleNavigateHome = useCallback(() => {
        navigate("/");
    }, [navigate]);

    return (
        <ActionList $isOpen={isOpen}>
            <Action>
                <ActionButton onClick={toggle}>
                    <ActionIcon>
                        <Icon name={isOpen ? "arrow-left2" : "arrow-right2"} size={16} />
                    </ActionIcon>
                </ActionButton>
            </Action>
            <Action>
                <ActionButton onClick={handleNavigateSettings}>
                    <ActionIcon>
                        <Icon name="cog" size={16} />
                    </ActionIcon>
                </ActionButton>
            </Action>
            <Action>
                <ActionButton onClick={handleNavigateHome}>
                    <ActionIcon>
                        <Icon name="home" size={16} />
                    </ActionIcon>
                </ActionButton>
            </Action>
        </ActionList>
    );
}

const ActionList = styled.ul<{ $isOpen: boolean }>`
    padding: 1rem 0 1rem 0;
    margin: 0;

    display: flex;
    flex-direction: ${(props) => (props.$isOpen ? "row" : "column-reverse")};
    justify-content: center;

    list-style: none;
`;

const Action = styled.li`
    padding: 0;
    margin: 0;
`;

const ActionButton = styled.button`
    padding: 4px;
    margin: 0;

    display: flex;
    flex-direction: row;
    align-items: center;

    border: 0;
    color: #ffffff;
    background: transparent;
    text-align: left;
    cursor: pointer;
    border-radius: 50%;
    font-size: 1rem;

    &:focus {
        outline: 0;
    }
`;

const ActionIcon = styled.div`
    width: 32px;
    height: 32px;

    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: 50%;
    fill: #ffffff;
    background-color: #202020;

    &:hover {
        background-color: #303030;
    }
`;
