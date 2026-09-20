import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "../../components/Button";
import { TextField } from "../../components/TextField";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

interface CreatePlaylistModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => Promise<void>;
}

export function CreatePlaylistModal({ visible, onClose, onCreate }: CreatePlaylistModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!name.trim()) {
      setError("Give your playlist a name.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onCreate(name.trim(), description.trim());
      setName("");
      setDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't create the playlist.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.title}>New playlist</Text>
          <TextField label="Name" value={name} onChangeText={setName} placeholder="My playlist" error={error} />
          <TextField
            label="Description (optional)"
            value={description}
            onChangeText={setDescription}
            placeholder="What's this playlist about?"
          />
          <Button title="Create playlist" onPress={handleCreate} loading={loading} style={styles.submit} />
          <Button title="Cancel" variant="ghost" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(5, 11, 24, 0.7)",
  },
  sheet: {
    backgroundColor: colors.navy800,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: colors.navy600,
  },
  title: {
    ...typography.h2,
    color: colors.white,
    marginBottom: 20,
  },
  submit: {
    marginTop: 4,
  },
});
