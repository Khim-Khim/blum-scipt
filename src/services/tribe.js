import colors from "colors";
import delayHelper from "../helpers/delay.js";

class TribeService {
  constructor() {}

  async getInfo(user) {
    try {
      const { data } = await user.http.get(2, "tribe/my");
      if (data) {
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      if (error.response?.data?.message === "NOT_FOUND") {
        return false;
      } else {
        return null;
      }
    }
  }

  async getLeaderboard(user) {
    try {
      const { data } = await user.http.get(2, "tribe/leaderboard");
      if (data) {
        const top100 = data.items.slice(0, 100);
        const tribeSkip = user?.database?.tribeSkip || [
          "d5a16880-d0d5-417d-9206-56cc8e1b2ae2",
        ];
        return top100
          .filter((tribe) => !tribeSkip.includes(tribe.id))
          .map((tribe) => tribe.id);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      return [];
    }
  }

  async joinTribe(
    user,
    tribeId = "d5a16880-d0d5-417d-9206-56cc8e1b2ae2",
    skipLog = false
  ) {
    const endpoint = `tribe/${tribeId}/join`;
    try {
      const { data } = await user.http.post(2, endpoint, {});
      if (data) {
        if (!skipLog) {
          user.log.log(
            "Tham gia thành công Tribe: " +
              colors.rainbow("69") +
              " 🌈"
          );
        }
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      if (!skipLog) {
        user.log.logError(
          `Tham gia tribe thất bại: ${error.response?.data?.message}`
        );
      }
    }
  }

  async leaveTribe(user) {
    const endpoint = `tribe/leave`;
    try {
      const { data } = await user.http.post(2, endpoint, {});

      if (data) {
        return true;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      return false;
    }
  }

  async handleTribe(user) {
    const infoTribe = await this.getInfo(user);

    if (infoTribe === null) return;

    if (!infoTribe) {
      await this.joinTribe(user);
    } else {
      const top100 = await this.getLeaderboard(user);
      const canLeaveTribe = top100.includes(infoTribe.id);

      if (canLeaveTribe) {
        await this.leaveTribe(user);
        await delayHelper.delay(3);
        await this.joinTribe(
          user,
          "d5a16880-d0d5-417d-9206-56cc8e1b2ae2",
          true
        );
      }
    }
  }
}

const tribeService = new TribeService();
export default tribeService;
