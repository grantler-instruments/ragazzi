import DeleteIcon from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { getClient } from "../mqtt";
import { useMqttStore } from "../stores/mqtt";

export default function Subscriptions() {
  const subscriptions = useMqttStore((state) => state.subscriptions);
  const subscribe = useMqttStore((state) => state.subscribe);
  const unsubscribe = useMqttStore((state) => state.unsubscribe);
  const removeSubscription = useMqttStore((state) => state.removeSubscription);

  const toggleSubscription = (key: string) => {
    return () => {
      if (subscriptions.get(key)) {
        getClient().unsubscribe(key);
        unsubscribe(key);
      } else {
        getClient().subscribe(key);
        subscribe(key);
      }
    };
  };
  return (
    <Card>
      <CardContent>
        <Typography color="text.primary" gutterBottom>
          <b>Subscriptions</b>
        </Typography>

        <List dense>
          {[...subscriptions.keys()].map((key, index) => {
            const active = Boolean(subscriptions.get(key));
            return (
              <ListItem
                key={index}
                secondaryAction={
                  <Tooltip title={active ? "Unsubscribe before removing" : "Remove"}>
                    <span>
                      <IconButton
                        edge="end"
                        aria-label="remove"
                        size="small"
                        disabled={active}
                        onClick={() => removeSubscription(key)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                }
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={active}
                      onChange={() => toggleSubscription(key)()}
                      name={key}
                      color="primary"
                    />
                  }
                  label={key}
                />
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
}
