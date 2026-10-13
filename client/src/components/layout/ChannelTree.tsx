/**
 * ChannelTree — OUR version (translation-app sidebar foundation).
 *
 * The upstream `.ch-tree` element (friends / DMs / server channel tree plus all of
 * its modals, context menus and portals) has been removed from this file.
 * Pristine upstream copy is frozen at `./ChannelTree.original.tsx`
 * (byte-identical backup, not imported anywhere — do not edit it).
 *
 * Same props contract as upstream so `Sidebar.tsx` keeps working untouched.
 * Build our own left-sidebar content here.
 */

type ChannelTreeProps = {
  onJoinVoice: (channelId: string) => void;
};

function ChannelTree({ onJoinVoice }: ChannelTreeProps) {
  void onJoinVoice;

  return (
    <div className="ch-tree-ours" style={{ padding: 12, opacity: 0.7, fontSize: 13 }}>
      our sidebar goes here
    </div>
  );
}

export default ChannelTree;
