import React, { useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "./src/services/api";

export default function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login");
  const [screen, setScreen] = useState("dashboard");
  const [auth, setAuth] = useState({ name: "Demo Student", email: "student@intellipath.dev", password: "password123", education: "Degree" });
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [recommendations, setRecommendations] = useState(null);
  const [progress, setProgress] = useState(null);
  const [chatInput, setChatInput] = useState("Which skills should I learn first?");
  const [chatReply, setChatReply] = useState("");
  const [error, setError] = useState("");

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  async function authenticate() {
    setError("");
    try {
      const path = mode === "login" ? "/auth/login" : "/auth/register";
      const data = await api(path, { method: "POST", body: auth });
      setToken(data.token);
      setUser(data.user);
      await refreshProgress(data.token);
    } catch (err) {
      setError(err.message);
    }
  }

  async function submitAptitude() {
    const data = await api("/aptitude", { method: "POST", headers, body: { answers } });
    setRecommendations(data.recommendations);
    setScreen("recommendations");
    await refreshProgress(token);
  }

  async function loadAptitudeQuestions() {
    const data = await api("/aptitude/questions", { headers });
    setQuestions(data.questions);
    setScreen("aptitude");
  }

  async function loadRecommendations() {
    const data = await api("/recommend", { headers });
    setRecommendations(data);
    setScreen("recommendations");
  }

  async function refreshProgress(activeToken = token) {
    if (!activeToken) return;
    const data = await api("/progress", { headers: { Authorization: `Bearer ${activeToken}` } });
    setProgress(data);
  }

  async function askBot() {
    const data = await api("/chatbot", { method: "POST", headers, body: { message: chatInput } });
    setChatReply(data.reply);
    await refreshProgress();
  }

  if (!token) {
    return (
      <SafeAreaView style={styles.shell}>
        <ScrollView contentContainerStyle={styles.authWrap}>
          <View style={styles.brandRow}>
            <Ionicons name="compass" size={32} color="#2f6f73" />
            <Text style={styles.brand}>Intellipath</Text>
          </View>
          <Text style={styles.title}>Career guidance that starts with your aptitude.</Text>
          {mode === "register" && <Field label="Name" value={auth.name} onChangeText={(name) => setAuth({ ...auth, name })} />}
          <Field label="Email" value={auth.email} onChangeText={(email) => setAuth({ ...auth, email })} autoCapitalize="none" />
          <Field label="Password" value={auth.password} onChangeText={(password) => setAuth({ ...auth, password })} secureTextEntry />
          {mode === "register" && <Field label="Education" value={auth.education} onChangeText={(education) => setAuth({ ...auth, education })} />}
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button icon="log-in" label={mode === "login" ? "Login" : "Create account"} onPress={authenticate} />
          <TouchableOpacity onPress={() => setMode(mode === "login" ? "register" : "login")}>
            <Text style={styles.switchText}>{mode === "login" ? "Need an account? Register" : "Already registered? Login"}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.shell}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.hello}>Hello, {user?.name}</Text>
          <Text style={styles.subtle}>{user?.education || "Student"} career dashboard</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setToken(null)}>
          <Ionicons name="exit-outline" size={22} color="#263238" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <Tab icon="grid" active={screen === "dashboard"} onPress={() => setScreen("dashboard")} />
        <Tab icon="clipboard" active={screen === "aptitude"} onPress={loadAptitudeQuestions} />
        <Tab icon="school" active={screen === "recommendations"} onPress={loadRecommendations} />
        <Tab icon="chatbubble" active={screen === "chat"} onPress={() => setScreen("chat")} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {screen === "dashboard" && <Dashboard progress={progress} recommendations={recommendations} onStart={loadAptitudeQuestions} />}
        {screen === "aptitude" && <Aptitude questions={questions} answers={answers} setAnswers={setAnswers} onSubmit={submitAptitude} />}
        {screen === "recommendations" && <Recommendations data={recommendations} />}
        {screen === "chat" && (
          <View>
            <Text style={styles.sectionTitle}>Career Chatbot</Text>
            <View style={styles.quickRow}>
              <SmallButton label="Logical Q" onPress={() => setChatInput("Frame one logical aptitude question")} />
              <SmallButton label="Technical Q" onPress={() => setChatInput("Frame one technical aptitude question")} />
              <SmallButton label="Career Help" onPress={() => setChatInput("Which skills should I learn first?")} />
            </View>
            <Field label="Ask a question" value={chatInput} onChangeText={setChatInput} multiline />
            <Button icon="send" label="Ask chatbot" onPress={askBot} />
            {chatReply ? <Text style={styles.reply}>{chatReply}</Text> : null}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Dashboard({ progress, recommendations, onStart }) {
  const topCareer = recommendations?.careers?.[0]?.title || "Take the aptitude test";
  return (
    <View>
      <Text style={styles.sectionTitle}>Dashboard</Text>
      <View style={styles.metricRow}>
        <Metric label="Points" value={progress?.points ?? 0} />
        <Metric label="Badges" value={progress?.badges?.length ?? 0} />
      </View>
      <Info title="Top recommendation" body={topCareer} />
      <Button icon="play" label="Start aptitude test" onPress={onStart} />
      {progress?.badges?.map((badge) => <Info key={badge} title={badge} body="Achievement unlocked" />)}
    </View>
  );
}

function Aptitude({ questions, answers, setAnswers, onSubmit }) {
  if (!questions.length) {
    return (
      <View>
        <Text style={styles.sectionTitle}>Aptitude Test</Text>
        <Info title="Loading questions" body="Open the aptitude tab again if questions do not appear." />
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.sectionTitle}>Aptitude Test</Text>
      {questions.map((question, index) => (
        <QuestionCard
          key={question.id}
          index={index}
          question={question}
          selected={answers[question.id]}
          onSelect={(optionId) => setAnswers({ ...answers, [question.id]: optionId })}
        />
      ))}
      <Button icon="sparkles" label="Get recommendations" onPress={onSubmit} />
    </View>
  );
}

function QuestionCard({ index, question, selected, onSelect }) {
  return (
    <View style={styles.questionCard}>
      <Text style={styles.questionMeta}>{index + 1}. {question.category.toUpperCase()}</Text>
      <Text style={styles.questionText}>{question.question}</Text>
      {question.options.map((option) => (
        <TouchableOpacity key={option.id} style={[styles.option, selected === option.id && styles.optionSelected]} onPress={() => onSelect(option.id)}>
          <Ionicons name={selected === option.id ? "radio-button-on" : "radio-button-off"} size={18} color={selected === option.id ? "#ffffff" : "#2f6f73"} />
          <Text style={[styles.optionText, selected === option.id && styles.optionTextSelected]}>{option.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function Recommendations({ data }) {
  if (!data) return <Info title="No recommendations yet" body="Complete the aptitude test to generate personalized guidance." />;
  return (
    <View>
      <Text style={styles.sectionTitle}>Recommendations</Text>
      {data.careers?.map((career) => <Info key={career.id} title={career.title} body={`${career.description}\nSkills: ${career.skills.join(", ")}`} />)}
      <Text style={styles.sectionTitle}>Courses</Text>
      {data.courses?.map((course) => <Info key={course.id} title={course.title} body={`${course.provider} - ${course.duration}`} />)}
      <Text style={styles.sectionTitle}>Colleges</Text>
      {data.colleges?.map((college) => <Info key={college.id} title={college.name} body={`${college.location} - ${college.streams.join(", ")}`} />)}
      <Text style={styles.sectionTitle}>Scholarships</Text>
      {data.scholarships?.map((scholarship) => <Info key={scholarship.id} title={scholarship.title} body={scholarship.eligibility} />)}
    </View>
  );
}

function Field({ label, ...props }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={[styles.input, props.multiline && styles.textarea]} placeholderTextColor="#829090" {...props} />
    </View>
  );
}

function Button({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons name={icon} size={18} color="#fff" />
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

function SmallButton({ label, onPress }) {
  return (
    <TouchableOpacity style={styles.smallButton} onPress={onPress}>
      <Text style={styles.smallButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

function Tab({ icon, active, onPress }) {
  return (
    <TouchableOpacity style={[styles.tab, active && styles.tabActive]} onPress={onPress}>
      <Ionicons name={icon} size={21} color={active ? "#ffffff" : "#2f6f73"} />
    </TouchableOpacity>
  );
}

function Metric({ label, value }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.subtle}>{label}</Text>
    </View>
  );
}

function Info({ title, body }) {
  return (
    <View style={styles.info}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoBody}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: "#f5f7f4" },
  authWrap: { padding: 24, minHeight: "100%", justifyContent: "center" },
  brandRow: { flexDirection: "row", gap: 10, alignItems: "center", marginBottom: 18 },
  brand: { fontSize: 30, fontWeight: "800", color: "#183c40" },
  title: { fontSize: 22, lineHeight: 30, color: "#263238", fontWeight: "700", marginBottom: 24 },
  topBar: { padding: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#ffffff" },
  hello: { fontSize: 20, fontWeight: "800", color: "#183c40" },
  subtle: { color: "#617071", marginTop: 3 },
  iconBtn: { width: 42, height: 42, borderRadius: 8, backgroundColor: "#eef2ed", alignItems: "center", justifyContent: "center" },
  tabs: { flexDirection: "row", gap: 10, padding: 12, backgroundColor: "#ffffff", borderTopWidth: 1, borderTopColor: "#edf0ec" },
  tab: { flex: 1, height: 42, borderRadius: 8, borderWidth: 1, borderColor: "#bcd2cc", alignItems: "center", justifyContent: "center" },
  tabActive: { backgroundColor: "#2f6f73", borderColor: "#2f6f73" },
  content: { padding: 18, paddingBottom: 36 },
  sectionTitle: { fontSize: 21, fontWeight: "800", color: "#183c40", marginBottom: 12, marginTop: 6 },
  field: { marginBottom: 14 },
  label: { color: "#435556", fontWeight: "700", marginBottom: 6 },
  input: { backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#d7dfdb", borderRadius: 8, padding: 12, fontSize: 16, color: "#263238" },
  textarea: { minHeight: 90, textAlignVertical: "top" },
  button: { height: 48, borderRadius: 8, backgroundColor: "#2f6f73", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, marginVertical: 8 },
  buttonText: { color: "#ffffff", fontWeight: "800", fontSize: 16 },
  smallButton: { borderRadius: 8, borderWidth: 1, borderColor: "#bcd2cc", paddingVertical: 9, paddingHorizontal: 10, backgroundColor: "#ffffff" },
  smallButtonText: { color: "#2f6f73", fontWeight: "800" },
  quickRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  switchText: { color: "#2f6f73", fontWeight: "700", textAlign: "center", marginTop: 12 },
  error: { color: "#b3261e", fontWeight: "700", marginBottom: 8 },
  metricRow: { flexDirection: "row", gap: 12, marginBottom: 8 },
  metric: { flex: 1, backgroundColor: "#ffffff", borderRadius: 8, padding: 16, borderWidth: 1, borderColor: "#d7dfdb" },
  metricValue: { fontSize: 28, fontWeight: "900", color: "#ba6b30" },
  info: { backgroundColor: "#ffffff", borderRadius: 8, padding: 14, borderWidth: 1, borderColor: "#d7dfdb", marginBottom: 10 },
  infoTitle: { color: "#183c40", fontWeight: "800", fontSize: 16, marginBottom: 4 },
  infoBody: { color: "#435556", lineHeight: 21 },
  questionCard: { backgroundColor: "#ffffff", borderRadius: 8, padding: 14, borderWidth: 1, borderColor: "#d7dfdb", marginBottom: 12 },
  questionMeta: { color: "#ba6b30", fontWeight: "900", marginBottom: 6, fontSize: 12 },
  questionText: { color: "#183c40", fontWeight: "800", fontSize: 16, lineHeight: 22, marginBottom: 10 },
  option: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 8, borderWidth: 1, borderColor: "#d7dfdb", padding: 10, marginTop: 8 },
  optionSelected: { backgroundColor: "#2f6f73", borderColor: "#2f6f73" },
  optionText: { color: "#435556", flex: 1, lineHeight: 20 },
  optionTextSelected: { color: "#ffffff", fontWeight: "700" },
  reply: { backgroundColor: "#fff8ed", borderRadius: 8, padding: 14, color: "#3d3d32", lineHeight: 22, marginTop: 10 }
});
