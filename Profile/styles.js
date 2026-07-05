import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const CARD_WIDTH = (width - 52) / 2;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  /* Header */

  header: {
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: "#3B82F6",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  avatarContainer: {
    position: "relative",
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "#fff",
  },

  editButton: {
    position: "absolute",
    right: 2,
    bottom: 2,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },

  name: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 15,
    color: "#E0F2FE",
  },

  /* Device Card */

  deviceCard: {
    marginHorizontal: 18,
    marginTop: -20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 5,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },

  deviceName: {
    marginTop: 18,
    fontSize: 22,
    fontWeight: "700",
    color: "#2563EB",
  },

  imei: {
    marginTop: 6,
    color: "#64748B",
    fontSize: 14,
  },

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
  },

  statusItem: {
    alignItems: "center",
  },

  statusText: {
    marginTop: 5,
    fontSize: 12,
    color: "#334155",
  },

  selectButton: {
    marginTop: 22,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#3B82F6",

    justifyContent: "center",
    alignItems: "center",

    flexDirection: "row",
  },

  selectText: {
    color: "#fff",
    fontWeight: "700",
    marginRight: 8,
    fontSize: 15,
  },

  /* Sections */

  section: {
    marginTop: 28,
    marginHorizontal: 18,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 18,
    color: "#0F172A",
  },

  /* Quick Actions */

  actionCard: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 22,

    alignItems: "center",

    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  actionIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,

    justifyContent: "center",
    alignItems: "center",
  },

  actionTitle: {
    marginTop: 12,
    fontWeight: "600",
    color: "#334155",
    fontSize: 15,
  },

  /* Account Card */

  infoCard: {
    marginTop: 12,
    marginHorizontal: 18,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingVertical: 14,
  },

  infoLabel: {
    color: "#94A3B8",
    fontSize: 13,
  },

  infoValue: {
    marginTop: 5,
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
  },

  /* Logout */

  logoutButton: {
    marginHorizontal: 18,
    marginTop: 30,

    backgroundColor: "#FEE2E2",

    borderRadius: 18,

    height: 56,

    justifyContent: "center",
    alignItems: "center",

    flexDirection: "row",
  },

  logoutText: {
    color: "#DC2626",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },

  /* Modal */

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.35)",
    justifyContent: "flex-end",
  },

  modal: {
    backgroundColor: "#fff",

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    padding: 22,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 20,
  },

  deviceItem: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    paddingVertical: 16,

    borderBottomWidth: 1,

    borderBottomColor: "#F1F5F9",
  },

  deviceItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },

  deviceItemImei: {
    marginTop: 5,
    color: "#64748B",
    fontSize: 13,
  },

  closeButton: {
    marginTop: 24,

    backgroundColor: "#3B82F6",

    height: 52,

    borderRadius: 14,

    justifyContent: "center",

    alignItems: "center",
  },

  closeButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  }, 

  bottomView:{
    paddingBottom:30,
    backgroundColor:"black"
  }
});