# Blender 角色资产规范

当前游戏的相机在角色后方，跑道前进方向是 `-Z`。如果要替换照片占位角色，请从 Blender 导出经过整理的 `.glb`，不要把 `.blend` 或 `.fbx` 直接放进网页。

当前清单只有两位角色：

- `yang-hang.glb`：白色运动服角色，对应杨杭，保留 F1 氮气冲刺。
- `runner-02.glb`：黑裤白 T 恤角色，使用普通跑酷动作。

两张多角度参考图已放在 `public/assets/characters/reference/`，分别是 `yang-hang-reference.png` 和 `runner-02-reference.png`。它们是建模参考，不会直接当作 3D 模型；菜单头像仍使用轻量 JPG，GLB 加载失败时也会保留程序化角色作为后备。

## Blender 设置

1. 使用米制单位，角色脚底放在 `Z = 0`，根节点命名为 `CharacterRoot`。
2. 角色面朝 Blender 的 `-Y`，导出 glTF 时保持 **+Y Up / -Z Forward**。
3. 应用位置、旋转和缩放，避免运行时通过额外旋转补偿模型朝向。
4. 骨骼根节点命名为 `Armature`；动画至少提供 `Idle`、`Run`、`Jump`、`Slide` 四个动作。Mixamo 导入后请在 Blender 里统一动作名称并删除未使用的动作。
5. 面部、衣服和鞋子尽量复用材质，角色总材质控制在 3 个以内。

## 移动端预算

- 普通跑者：约 15k-25k 三角形；F1 冲刺车：约 8k-15k 三角形。
- 角色纹理优先使用 512 或 1024 方图，PNG 只用于需要透明的贴图。
- 删除不可见的身体内面、空骨骼和未使用材质。
- 可生成一个 50% 面数的 LOD，低端手机优先使用低 LOD。
- 导出后用 glTF Transform 做 prune、dedup 和 meshopt 压缩，再放入 `public/assets/characters/`。

## 建模和绑定顺序

1. 用多角度参考图在 Blender 手工建模，或先用 Tripo、Meshy、Hyper3D 生成初始网格。
2. 在 Blender 里重拓扑、清理穿插面和隐藏内面，重新检查眼镜、头发、衣物和鞋子的材质。
3. 用 Mixamo 自动绑定并下载跑步、跳跃、滑铲动作，再回 Blender 修脚底接触和循环衔接。
4. 统一缩放、应用变换、设置根节点与动作名称后导出 GLB。

## glTF Transform 压缩

在项目根目录执行下面的命令，把 Blender 导出的文件压缩后放到 `public/assets/characters/`：

```powershell
npx --yes @gltf-transform/cli optimize .\exports\yang-hang.glb .\public\assets\characters\yang-hang.glb --compress meshopt
npx --yes @gltf-transform/cli optimize .\exports\runner-02.glb .\public\assets\characters\runner-02.glb --compress meshopt
npx --yes @gltf-transform/cli inspect .\public\assets\characters\yang-hang.glb
```

`optimize` 会执行常用的 prune、dedup 和网格优化；纹理仍需控制在 512 或 1024 方图。运行时已经启用 Three.js 的 Meshopt 解码器，压缩后的 GLB 可以直接被加载。

## 导出检查

在 Blender 的 glTF 2.0 导出器中选择 **Format: GLB**、**+Y Up**，包含网格、骨骼、动作和材质。导出后检查：角色脚底没有漂浮，前进方向为 `-Z`，动作循环没有反向播放，材质没有引用本机绝对路径。

当前运行时已经按上述路径尝试加载 GLB，并在文件不存在、下载失败或动画缺失时自动回退到程序化角色。收到 `.blend` 或压缩后的 `.glb` 后，只需使用约定文件名放入目录，游戏会自动切换为真正可旋转的完整模型；照片会保留为菜单头像和加载失败时的后备显示。
