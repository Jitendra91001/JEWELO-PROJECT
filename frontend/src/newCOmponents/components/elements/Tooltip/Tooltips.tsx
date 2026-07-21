
import { Tooltip } from "antd";
import { TooltipProps } from "antd/lib/tooltip";




export default function MyTooltip(props: TooltipProps) {
    return (
        <Tooltip title={props.title}
            placement={props.placement}
            open={props.open}
            arrow={props.arrow}
            autoAdjustOverflow={props.autoAdjustOverflow}
            trigger={props.trigger}
            zIndex={props.zIndex}
            mouseEnterDelay={props.mouseEnterDelay}>
            {props.children}
        </Tooltip>
    );
}