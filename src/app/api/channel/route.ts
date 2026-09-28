import { NextRequest, NextResponse } from "next/server";

import { createInsforgeServerClient } from "@/lib/insforge-server";

export async function GET(request: NextRequest) {
  try {
    const { insforge, userId } = await createInsforgeServerClient();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const filter = request.nextUrl.searchParams.get("filter");

    const [typesRes, userchannelsRes] = await Promise.all([
      insforge.database
        .from("channel_types")
        .select("*")
        .order("created_at", { ascending: true }),
      insforge.database.from("user_channels").select("*").eq("user_id", userId),
    ]);

    if (typesRes.error)
      return NextResponse.json({ error: typesRes.error }, { status: 500 });

    if (userchannelsRes.error)
      return NextResponse.json(
        { error: userchannelsRes.error },
        { status: 500 },
      );

    const userChannelMap = new Map(
      userchannelsRes.data.map((channel) => [channel.channel_type_id, channel]),
    );

    let channels = (typesRes.data || []).map((channel_type) => {
      const userChannel = userChannelMap.get(channel_type.id);

      return {
        ...channel_type,
        user_channel_id: userChannel?.id ?? null,
        handle: userChannel?.handle ?? null,
        profile_image: userChannel?.profile_image ?? null,
        profile_url: userChannel?.profile_url ?? null,
        connected: userChannel?.is_connected ?? false,
      };
    });

    const totalChannels = typesRes.data?.length || 0;
    const connectedChannels = channels.filter(
      (channel) => channel.connected,
    ).length;

    if (filter === "connected") {
      channels = channels.filter((channel) => channel.connected);
    } else if (filter === "disconnected") {
      channels = channels.filter((channel) => !channel.connected);
    }

    return NextResponse.json({
      channels,
      totalChannels,
      connectedChannels,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
