<template>
  <div class="dashboard-container">
    <el-row :gutter="10">
      <el-col :span="4">
        <el-card class="box-card" shadow="hover">
          <div slot="header">
            <span>service设置</span>
          </div>
          <el-form ref="formService" :model="formService" :rules="rules">
            <el-form-item label="" prop="type" :disabled="flag === 'edit'">
              <el-select v-model="formService.type" placeholder="请选择类型">
                <el-option label="编码器" :value="0" />
                <!-- <el-option label="解码器" :value="1" /> -->
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="name">
              <el-input v-model="formService.name" placeholder="请输入频道名称" />
            </el-form-item>
            <el-form-item>
              <el-button v-if="channel.status !== 1" type="warning" @click="onSubmitService('formService')">保存配置</el-button>
              <a href="javascript:window.history.go(-1);">
                <el-button>取消</el-button>
              </a>
            </el-form-item>
          </el-form>
        </el-card>

      </el-col>

      <el-col v-if="formService.type === 0 || formService.type === 1" :span="curr === 'input'? 12 : 4">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix cardHeader" :class="{current: curr === 'input'}" @click="toggle('input')">
            <span>输入配置</span>
            <el-button v-if="curr === 'input'" type="text" icon="el-icon-arrow-down" />
            <el-button v-else type="text" icon="el-icon-arrow-right" />
          </div>
          <template v-if="curr === 'input'">
            <div v-if="handle === 'form'" class="grid-form">
              <el-form ref="formInput" :model="formInput" label-width="120px" :rules="rules">
                <!-- <el-form-item label="名称" prop="inputName">
                  <el-input v-model="formInput.inputName" placeholder="请输入名称" />
                </el-form-item> -->
                <el-form-item label="类型" prop="type">
                  <el-select v-model="formInput.type" placeholder="请选择类型">
                    <!-- <el-option label="设备" :value="0" /> -->
                    <el-option label="网络" :value="1" />
                    <!-- <el-option label="文件" :value="2" /> -->
                  </el-select>
                </el-form-item>
                <el-form-item label="协议" prop="protocol">
                  <el-select v-model="formInput.protocol" placeholder="请选择协议">
                    <template v-if="formInput.type === 1">
                      <el-option label="UDP" value="UDP" />
                      <el-option label="RTMP" value="RTMP" />
                      <el-option label="RTP" value="RTP" />
                      <el-option label="DASH" value="DASH" />
                      <el-option label="HLS" value="HLS" />
                    </template>
                    <template v-else>
                      <el-option label="FILE" value="FILE" />
                    </template>
                  </el-select>
                </el-form-item>
                <el-form-item label="链接地址" prop="url">
                  <el-input v-model="formInput.url" placeholder="请输入链接地址" />
                </el-form-item>
                <el-form-item label="解码格式" prop="decoder">
                  <el-select v-model="formInput.decoder" placeholder="请选择解码格式">
                    <el-option label="PASS" value="" />
                    <el-option v-for="(v, k) in decoder_obj" :key="k" :label="v" :value="k" />
                  </el-select>
                </el-form-item>
                <el-form-item label="参数1">
                  <el-col :span="11">
                    <el-input v-model="formInput.para_name1" placeholder="请输入参数名称" />
                  </el-col>
                  <el-col class="line" :span="2" />
                  <el-col :span="11">
                    <el-input v-model="formInput.para_value1" placeholder="请输入参数值" />
                  </el-col>
                </el-form-item>
                <el-form-item label="参数2">
                  <el-col :span="11">
                    <el-input v-model="formInput.para_name2" placeholder="请输入参数名称" />
                  </el-col>
                  <el-col class="line" :span="2" />
                  <el-col :span="11">
                    <el-input v-model="formInput.para_value2" placeholder="请输入参数值" />
                  </el-col>
                </el-form-item>
                <el-form-item label="参数3">
                  <el-col :span="11">
                    <el-input v-model="formInput.para_name3" placeholder="请输入参数名称" />
                  </el-col>
                  <el-col class="line" :span="2" />
                  <el-col :span="11">
                    <el-input v-model="formInput.para_value3" placeholder="请输入参数值" />
                  </el-col>
                </el-form-item>
                <el-form-item>
                  <el-button type="warning" @click="onSubmitInput('formInput')">确定</el-button>
                  <el-button @click="handle = 'view'">取消</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div v-else class="grid-info">
              <el-table v-if="inputList && inputList.length" ref="inputTable" :data="inputList" size="small" height="350">
                <el-table-column label="" width="34">
                  <template slot-scope="scope">
                    <el-radio v-model="inputIndex" :label="scope.row.id" :disabled="(channel.type === 1 && scope.row.type === 0) || (flag === 'edit' && scope.row.used > 0 && scope.row.id !== channel.input.id)" @change="inputChange(scope.row)" />
                  </template>
                </el-table-column>
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <el-form label-position="left" inline class="table-expand">
                      <el-form-item label="ID："><span>{{ scope.row.id }}</span></el-form-item>
                      <!-- <el-form-item label="类型："><span>{{ scope.row.type }}</span></el-form-item> -->
                      <el-form-item label="协议："><span>{{ scope.row.protocol }}</span></el-form-item>
                      <el-form-item v-if="scope.row.para_name1" label="参数1："><span>{{ scope.row.para_name1 }}：{{ scope.row.para_value1 }}</span></el-form-item>
                      <el-form-item v-if="scope.row.para_name2" label="参数2："><span>{{ scope.row.para_name2 }}：{{ scope.row.para_value2 }}</span></el-form-item>
                      <el-form-item v-if="scope.row.para_name3" label="参数3："><span>{{ scope.row.para_name3 }}：{{ scope.row.para_value3 }}</span></el-form-item>
                      <el-form-item v-if="scope.row.log" label="log："><span>{{ scope.row.log }}</span></el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column type="index" width="50" />
                <el-table-column label="类型名称">
                  <template slot-scope="scope">{{ scope.row.typename }}</template>
                </el-table-column>
                <el-table-column label="链接地址">
                  <template slot-scope="scope">{{ scope.row.url }}</template>
                </el-table-column>
                <el-table-column label="解码格式">
                  <template v-if="scope.row.decoder" slot-scope="scope">{{ decoder_obj[scope.row.decoder] }}</template>
                  <template v-else>PASS</template>
                </el-table-column>
                <el-table-column label="状态">
                  <template slot-scope="scope">{{ scope.row.statusstr }}</template>
                </el-table-column>
                <el-table-column label="操作" width="110" fixed="right">
                  <template slot-scope="scope">
                    <el-button-group>
                      <el-button v-if="scope.row.type !== 0" size="mini" icon="el-icon-edit" round @click.stop="handleEditInput(scope.$index, scope.row)" />
                      <el-button v-if="scope.row.type !== 0 && scope.row.used === 0" size="mini" type="danger" icon="el-icon-delete" round @click.stop="delInput(scope.$index, scope.row.id)" />
                    </el-button-group>
                  </template>
                </el-table-column>
              </el-table>
              <p><el-button type="primary" size="medium" icon="el-icon-plus" plain @click="newData('input')">添加输入项</el-button></p>
            </div>
          </template>
          <template v-else>
            <div class="grid-info">
              <div v-if="input.id" class="formInfo">
                <!-- <p><span>类型：</span>{{ input.type }}</p> -->
                <p><span>类型名称：</span>{{ input.typename }}</p>
                <p><span>协议：</span>{{ input.protocol }}</p>
                <p><span>链接地址：</span>{{ input.url }}</p>
                <p v-if="input.decoder"><span>解码格式：</span>{{ decoder_obj[input.decoder] }}</p>
                <p v-else><span>解码格式：</span>PASS</p>
                <p><span>状态：</span>{{ input.statusstr }}</p>
                <p v-if="input.para_name1"><span>参数1：</span>{{ input.para_name1 }}：{{ input.para_value1 }}</p>
                <p v-if="input.para_name2"><span>参数2：</span>{{ input.para_name2 }}：{{ input.para_value2 }}</p>
                <p v-if="input.para_name3"><span>参数3：</span>{{ input.para_name3 }}：{{ input.para_value3 }}</p>
              </div>
            </div>
          </template>
        </el-card>
      </el-col>

      <el-col v-if="formService.type === 0" :span="curr === 'encode'? 12 : 4">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix cardHeader" :class="{current: curr === 'encode'}" @click="toggle('encode')">
            <span>编码配置</span>
            <el-button v-if="curr === 'encode'" type="text" icon="el-icon-arrow-down" />
            <el-button v-else type="text" icon="el-icon-arrow-right" />
          </div>

          <div v-show="curr === 'encode' && handle === 'form'" class="grid-form">
            <el-form ref="formEncode" :model="formEncode" label-width="120px" :rules="rules">
              <el-form-item label="视频编码" prop="v_codec">
                <el-select v-model="formEncode.v_codec" placeholder="请选择视频编码">
                  <el-option v-for="(v, k) in v_codec_obj" :key="k" :label="v" :value="k" />
                </el-select>
              </el-form-item>
              <el-form-item label="分辨率" prop="v_resolution">
                <el-select v-model="formEncode.v_resolution" placeholder="请选择分辨率">
                  <el-option label="auto" value="" />
                  <el-option label="7680x4320" value="7680x4320" />
                  <el-option label="3840x2160" value="3840x2160" />
                  <el-option label="1920x1080" value="1920x1080" />
                  <el-option label="1280x720" value="1280x720" />
                  <el-option label="640x360" value="640x360" />
                  <el-option label="Custom" value="Custom" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="formEncode.v_resolution === 'Custom'" label="自定义分辨率">
                <el-col :span="11">
                  <el-input v-model="formEncode.v_resolution_w" placeholder="宽" style="width: 100%;" />
                </el-col>
                <el-col class="line" :span="2" style="text-align: center;">×</el-col>
                <el-col :span="11">
                  <el-input v-model="formEncode.v_resolution_h" placeholder="高" style="width: 100%;" />
                </el-col>
              </el-form-item>
              <el-form-item label="视频码率" prop="v_bitrate">
                <el-input v-model="formEncode.v_bitrate" placeholder="请输入视频码率">
                  <template slot="append">kbps</template>
                </el-input>
              </el-form-item>
              <el-form-item label="视频帧率" prop="v_framerate">
                <el-select v-model="formEncode.v_framerate" placeholder="请选择视频帧率">
                  <el-option label="auto" value="" />
                  <el-option label="60" value="60" />
                  <el-option label="59.94" value="59.94" />
                  <el-option label="50" value="50" />
                  <el-option label="30" value="30" />
                  <el-option label="29.97" value="29.97" />
                  <el-option label="25" value="25" />
                  <el-option label="24" value="24" />
                  <el-option label="23.98" value="23.98" />
                </el-select>
              </el-form-item>
              <el-form-item label="profile" prop="v_profile">
                <el-select v-model="formEncode.v_profile" placeholder="请选择profile">
                  <el-option label="auto" value="" />
                  <el-option label="rext" value="rext" />
                  <el-option label="main" value="main" />
                  <el-option label="high" value="high" />
                  <el-option label="main10" value="main10" />
                  <el-option label="high10" value="high10" />
                </el-select>
              </el-form-item>
              <el-form-item label="预设值" prop="v_preset">
                <el-select v-model="formEncode.v_preset" placeholder="请选择预设值">
                  <el-option label="auto" value="" />
                  <template v-if="formEncode.v_codec === 'libx264' || formEncode.v_codec === 'libx265'">
                    <el-option label="ultrafast" value="ultrafast" />
                    <el-option label="superfast" value="superfast" />
                    <el-option label="veryfast" value="veryfast" />
                    <el-option label="faster" value="faster" />
                    <el-option label="fast" value="fast" />
                    <el-option label="medium" value="medium" />
                    <el-option label="slow" value="slow" />
                    <el-option label="slower" value="slower" />
                    <el-option label="veryslow" value="veryslow" />
                    <el-option label="placebo" value="placebo" />
                  </template>
                  <template v-else-if="formEncode.v_codec === 'h264_nvenc' || formEncode.v_codec === 'hevc_nvenc'">
                    <el-option label="slow" value="slow" />
                    <el-option label="medium" value="medium" />
                    <el-option label="fast" value="fast" />
                    <el-option label="hp" value="hp" />
                    <el-option label="hq" value="hq" />
                    <el-option label="bd" value="bd" />
                    <el-option label="ll" value="ll" />
                    <el-option label="llhq" value="llhq" />
                    <el-option label="llhp" value="llhp" />
                    <el-option label="lossless" value="lossless" />
                    <el-option label="losslesshp" value="losslesshp" />
                  </template>
                </el-select>
              </el-form-item>
              <el-form-item label="音频编码" prop="a_codec">
                <el-select v-model="formEncode.a_codec" placeholder="请选择音频编码">
                  <el-option label="PASS" value="copy" />
                  <el-option label="aac" value="aac" />
                  <el-option label="mp2" value="mp2" />
                  <el-option label="mp3" value="mp3" />
                </el-select>
              </el-form-item>
              <el-form-item label="音频采样率" prop="a_samplerate">
                <el-select v-model="formEncode.a_samplerate" placeholder="请选择音频采样率">
                  <el-option label="auto" value="" />
                  <el-option label="44100" value="44100" />
                  <el-option label="48000" value="48000" />
                  <el-option label="32000" value="32000" />
                </el-select>
              </el-form-item>
              <el-form-item label="音频码率" prop="a_bitrate">
                <el-select v-model="formEncode.a_bitrate" placeholder="请选择音频码率">
                  <el-option label="384k" value="384k" />
                  <el-option label="192k" value="192k" />
                  <el-option label="128k" value="128k" />
                  <el-option label="自定义" value="自定义" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="customBitrate" label="自定义音频码率" prop="a_bitrate_custom">
                <el-input v-model="formEncode.a_bitrate_custom" placeholder="请输入音频码率" />
              </el-form-item>
              <el-form-item label="视频像素格式" prop="v_format" style="display: none">
                <el-input v-model="formEncode.v_format" placeholder="" />
              </el-form-item>
              <!-- <el-form-item label="视频像素格式" prop="v_format">
                <el-select v-model="formEncode.v_format" placeholder="请选择视频像素格式">
                  <el-option label="auto" value="" />
                  <el-option label="yuv420p" value="yuv420p" />
                  <el-option label="yuyv422" value="yuyv422" />
                  <el-option label="uyvy422" value="uyvy422" />
                  <el-option label="444p" value="444p" />
                </el-select>
              </el-form-item> -->
              <el-form-item label="输出码率" prop="muxrate">
                <el-input v-model="formEncode.muxrate" placeholder="请输入输出码率" />
              </el-form-item>
              <el-form-item label="自定义参数" prop="custom">
                <el-input v-model="formEncode.custom" placeholder="请输入自定义参数" />
              </el-form-item>
              <el-form-item label="台标">
                <p>
                  <el-button v-if="!v_resolution_w || !v_resolution_h" type="primary" @click="$message({ message: '请选择分辨率！', type: 'error' })">选择台标</el-button>
                  <el-button v-else type="primary" @click="$refs.logoDialog.dialogVisible = true">选择台标</el-button>
                  <el-button v-show="checkedLogo && checkedLogo.id" type="danger" @click="cleanLogo">取消选择</el-button>
                </p>
                <Scale ref="logoScale" :url="checkedLogo.url || ''" :fatherw="v_resolution_w" :fatherh="v_resolution_h" :toppercent="formEncode.top_percent" :leftpercent="formEncode.left_percent" :widthpercent="formEncode.width_percent" :heightpercent="formEncode.height_percent" />
              </el-form-item>
              <el-form-item>
                <el-button type="warning" @click="onSubmitEncode('formEncode')">确定</el-button>
                <el-button @click="handle = 'view'">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div v-show="curr === 'encode' && handle !== 'form'" class="grid-info">
            <div v-if="formEncode && formEncode.v_codec" class="formInfo">
              <p><span>视频编码：</span>{{ v_codec_obj[formEncode.v_codec] }}</p>
              <p><span>视频宽度：</span>{{ formEncode.v_resolution_w }}</p>
              <p><span>视频高度：</span>{{ formEncode.v_resolution_h }}</p>
              <p><span>视频码率：</span>{{ formEncode.v_bitrate }}</p>
              <p><span>视频帧率：</span>{{ formEncode.v_framerate }}</p>
              <p><span>profile：</span>{{ formEncode.v_profile }}</p>
              <p><span>预设值：</span>{{ formEncode.v_preset }}</p>
              <!-- <p><span>视频像素格式：</span>{{ formEncode.v_format }}</p> -->
              <p><span>音频编码：</span>{{ formEncode.a_codec }}</p>
              <p><span>音频采样率：</span>{{ formEncode.a_samplerate }}</p>
              <p><span>音频码率：</span>{{ formEncode.a_bitrate }}</p>
              <p><span>输出码率：</span>{{ formEncode.muxrate }}</p>
              <!-- <p><span>执行命令：</span>{{ formEncode.command }}</p>
              <p><span>运行进程：</span>{{ formEncode.pid }}</p>
              <p><span>日志文件：</span>{{ formEncode.logfile }}</p>
              <p><span>预览地址：</span>{{ formEncode.previewurl }}</p>
              <p><span>日志：</span>{{ formEncode.log }}</p> -->
              <p><span>状态：</span>{{ formEncode.status }}</p>
              <p><span>台标：</span><img :src="formEncode.logo && formEncode.logo.url"></p>
            </div>
            <el-button v-if="flag === 'edit'" type="primary" size="medium" icon="el-icon-edit" plain @click="formEncode = channel;handle = 'form';">修改配置</el-button>
            <el-button v-if="flag === 'add'" type="primary" size="medium" icon="el-icon-edit" plain @click="handle = 'form'">修改配置</el-button>
          </div>
          <div v-show="curr !== 'encode'" class="grid-info">
            <div v-if="formEncode && formEncode.v_codec" class="formInfo">
              <p><span>视频编码：</span>{{ v_codec_obj[formEncode.v_codec] }}</p>
              <p><span>视频宽度：</span>{{ formEncode.v_resolution_w }}</p>
              <p><span>视频高度：</span>{{ formEncode.v_resolution_h }}</p>
              <p><span>视频码率：</span>{{ formEncode.v_bitrate }}</p>
              <p><span>视频帧率：</span>{{ formEncode.v_framerate }}</p>
              <p><span>profile：</span>{{ formEncode.v_profile }}</p>
              <p><span>预设值：</span>{{ formEncode.v_preset }}</p>
              <!-- <p><span>视频像素格式：</span>{{ formEncode.v_format }}</p> -->
              <p><span>音频编码：</span>{{ formEncode.a_codec }}</p>
              <p><span>音频采样率：</span>{{ formEncode.a_samplerate }}</p>
              <p><span>音频码率：</span>{{ formEncode.a_bitrate }}</p>
              <p><span>输出码率：</span>{{ formEncode.muxrate }}</p>
              <!-- <p><span>执行命令：</span>{{ formEncode.command }}</p>
              <p><span>运行进程：</span>{{ formEncode.pid }}</p>
              <p><span>日志文件：</span>{{ formEncode.logfile }}</p>
              <p><span>预览地址：</span>{{ formEncode.previewurl }}</p>
              <p><span>日志：</span>{{ formEncode.log }}</p> -->
              <p><span>状态：</span>{{ formEncode.status }}</p>
              <p><span>台标：</span><img :src="formEncode.logo && formEncode.logo.url"></p>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col v-if="formService.type === 0 || formService.type === 1" :span="curr === 'output'? 12 : 4">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix cardHeader" :class="{current: curr === 'output'}" @click="toggle('output')">
            <span>输出配置</span>
            <el-button v-if="curr === 'output'" type="text" icon="el-icon-arrow-down" />
            <el-button v-else type="text" icon="el-icon-arrow-right" />
          </div>
          <template v-if="curr === 'output'">
            <div v-if="handle === 'form'" class="grid-form">
              <el-form ref="formOutput" :model="formOutput" label-width="120px" :rules="rules">
                <!-- <el-form-item label="名称" prop="outputName">
                  <el-input v-model="formOutput.outputName" placeholder="请输入名称" />
                </el-form-item> -->
                <el-form-item label="类型" prop="type">
                  <el-select v-model="formOutput.type" placeholder="请选择类型">
                    <!-- <el-option label="设备" :value="0" /> -->
                    <el-option label="网络" :value="1" />
                    <!-- <el-option label="文件" :value="2" /> -->
                  </el-select>
                </el-form-item>
                <el-form-item label="协议" prop="protocol">
                  <el-select v-model="formOutput.protocol" placeholder="请选择协议">
                    <template v-if="formOutput.type === 1">
                      <el-option label="UDP" value="UDP" />
                      <el-option label="RTMP" value="RTMP" />
                      <el-option label="RTP" value="RTP" />
                      <el-option label="DASH" value="DASH" />
                      <el-option label="HLS" value="HLS" />
                    </template>
                    <template v-else>
                      <el-option label="FILE" value="FILE" />
                    </template>
                  </el-select>
                </el-form-item>
                <el-form-item label="链接地址" prop="url">
                  <el-input v-model="formOutput.url" placeholder="请输入链接地址" />
                </el-form-item>
                <el-form-item label="输出格式" prop="format">
                  <el-input v-model="formOutput.format" placeholder="请输入输出格式" />
                </el-form-item>
                <el-form-item label="ts信息" prop="tsinfo">
                  <el-input v-model="formOutput.tsinfo" placeholder="请输入ts信息" />
                </el-form-item>
                <el-form-item label="参数1">
                  <el-col :span="11">
                    <el-input v-model="formOutput.para_name1" placeholder="请输入参数名称" />
                  </el-col>
                  <el-col class="line" :span="2" />
                  <el-col :span="11">
                    <el-input v-model="formOutput.para_value1" placeholder="请输入参数值" />
                  </el-col>
                </el-form-item>
                <el-form-item label="参数2">
                  <el-col :span="11">
                    <el-input v-model="formOutput.para_name2" placeholder="请输入参数名称" />
                  </el-col>
                  <el-col class="line" :span="2" />
                  <el-col :span="11">
                    <el-input v-model="formOutput.para_value2" placeholder="请输入参数值" />
                  </el-col>
                </el-form-item>
                <el-form-item label="参数3">
                  <el-col :span="11">
                    <el-input v-model="formOutput.para_name3" placeholder="请输入参数名称" />
                  </el-col>
                  <el-col class="line" :span="2" />
                  <el-col :span="11">
                    <el-input v-model="formOutput.para_value3" placeholder="请输入参数值" />
                  </el-col>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmitOutput('formOutput')">确定</el-button>
                  <el-button @click="handle = 'view'">取消</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div v-else class="grid-info">
              <el-table v-if="outputList && outputList.length" ref="outputTable" :data="outputList" size="small" height="350">
                <el-table-column label="" width="34">
                  <template slot-scope="scope">
                    <el-checkbox v-model="outputIndex" :label="scope.row.id" :disabled="(channel.type === 0 && scope.row.type === 0) || (flag === 'edit' && scope.row.used > 0 && outputIndex.indexOf(scope.row.id) === -1)" @change="outputChange($event, scope.row)" />
                  </template>
                </el-table-column>
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <el-form label-position="left" inline class="table-expand">
                      <el-form-item label="ID："><span>{{ scope.row.id }}</span></el-form-item>
                      <!-- <el-form-item label="类型："><span>{{ scope.row.type }}</span></el-form-item> -->
                      <el-form-item label="协议："><span>{{ scope.row.protocol }}</span></el-form-item>
                      <el-form-item label="ts信息："><span>{{ scope.row.tsinfo }}</span></el-form-item>
                      <el-form-item v-if="scope.row.para_name1" label="参数1："><span>{{ scope.row.para_name1 }}：{{ scope.row.para_value1 }}</span></el-form-item>
                      <el-form-item v-if="scope.row.para_name2" label="参数2："><span>{{ scope.row.para_name2 }}：{{ scope.row.para_value2 }}</span></el-form-item>
                      <el-form-item v-if="scope.row.para_name3" label="参数3："><span>{{ scope.row.para_name3 }}：{{ scope.row.para_value3 }}</span></el-form-item>
                      <el-form-item v-if="scope.row.log" label="log："><span>{{ scope.row.log }}</span></el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column type="index" width="50" />
                <el-table-column label="类型名称">
                  <template slot-scope="scope">{{ scope.row.typename }}</template>
                </el-table-column>
                <el-table-column label="链接地址">
                  <template slot-scope="scope">{{ scope.row.url | formatUrl }}</template>
                </el-table-column>
                <el-table-column label="输出格式">
                  <template slot-scope="scope">{{ scope.row.format }}</template>
                </el-table-column>
                <el-table-column label="状态">
                  <template slot-scope="scope">{{ scope.row.statusstr }}</template>
                </el-table-column>
                <el-table-column label="操作" width="110" fixed="right">
                  <template slot-scope="scope">
                    <el-button-group>
                      <el-button v-if="scope.row.type !== 0" size="mini" icon="el-icon-edit" round @click="handleEditOutput(scope.$index, scope.row)" />
                      <el-button v-if="scope.row.type !== 0 && scope.row.used === 0" size="mini" type="danger" icon="el-icon-delete" round @click="delOutput(scope.$index, scope.row.id)" />
                    </el-button-group>
                  </template>
                </el-table-column>
              </el-table>
              <p><el-button type="primary" size="medium" icon="el-icon-plus" plain @click="newData('output')">添加输出项</el-button></p>
            </div>
          </template>
          <template v-else>
            <div v-if="output.length" class="grid-info">
              <div v-for="(o, index) in output" :key="index" class="formInfo">
                <!-- <p><span>类型：</span>{{ o.type }}</p> -->
                <p><span>类型名称：</span>{{ o.typename }}</p>
                <p><span>协议：</span>{{ o.protocol }}</p>
                <p><span>链接地址：</span>{{ o.url | formatUrl }}</p>
                <p><span>输出格式：</span>{{ o.format }}</p>
                <p><span>ts信息：</span>{{ o.tsinfo }}</p>
                <p><span>状态：</span>{{ o.statusstr }}</p>
                <p v-if="o.para_name1"><span>参数1：</span>{{ o.para_name1 }}：{{ o.para_value1 }}</p>
                <p v-if="o.para_name2"><span>参数2：</span>{{ o.para_name2 }}：{{ o.para_value2 }}</p>
                <p v-if="o.para_name3"><span>参数3：</span>{{ o.para_name3 }}：{{ o.para_value3 }}</p>
              </div>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
    <Logos ref="logoDialog" :checkedlogo="checkedLogo" @uploadlogo="uploadLogo($event)" @checklogo="checkLogo($event)" @dellogo="delLogo($event)" />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Scale from './scale.vue'
import Logos from './logos.vue'
// import logoZght from '@/assets/play/logo_zght.png'

export default {
  components: { Logos, Scale },
  filters: {
    ArrToStr(val) {
      if (val && val.length) {
        return val.join('-')
      }
    },
    formatUrl(val) {
      if (val.indexOf('?') > 0) {
        return val.substring(0, val.indexOf('?'))
      } else {
        return val
      }
    }
  },
  data() {
    return {
      loading: false,
      flag: 'add', // add or edit
      curr: '',
      handle: 'view', // view or form
      v_resolution_w: '1920',
      v_resolution_h: '1080',
      formService: {
        type: null,
        name: ''
      },
      formInput: {
        // inputName: '',
        type: '',
        protocol: '',
        url: '',
        decoder: 'hevc',
        para_name1: '',
        para_value1: '',
        para_name2: '',
        para_value2: '',
        para_name3: '',
        para_value3: ''
      },
      formEncode: {
        left_percent: 0, // Logo左边距 百分比 可选，上面Logo对象存在时必选----左边距百分比
        top_percent: 0, // Logo顶部边距 百分比 可选，上面Logo对象存在时必选----上边距百分比
        width_percent: 0, // Logo相对宽度 百分比 可选，上面Logo对象存在时必选----宽度百分比
        height_percent: 0, // Logo相对高度 百分比 可选，上面Logo对象存在时必选----高度百分比
        v_codec: 'hevc_nvenc', // 必选 ，copy/libx265/hevc_nvenc/libx264/h264_nvenc 必须----视频编码
        v_resolution: '',
        v_resolution_w: '', // 可选 7840x4320/ 3920x2160 / 1960x1080 / 1280x720 / 640 x 360 / Custom (w,hCustom)----视频宽度
        v_resolution_h: '', // 可选 可为空 或为 -1 ，w、h 必须同时存在或为空，不能同时为-1----视频高度
        v_bitrate: 10000, // 正整数 必选----视频码率
        v_framerate: '', // 60, 50, 30, 25, 24  可选，可为空，或列表选择----视频帧率
        v_profile: 'rext', // BaseLine/Main/High/Main10/High10 可选 ,可输入或列表，也可为空----profile
        v_preset: 'slow', // 可选----预设值
        // (libx264,libx265) ultrafast\superfast\veryfast\faster\fast\medium\slow\slower\veryslow\placebo
        // (h264_nvenc,hevc_nvenc) slow\medium\fast\hp\hq\bd\ll\llhq\llhp\lossless\losslesshp
        a_codec: 'aac', // copy /aac/mp2/mp3 必选----音频编码
        a_samplerate: '48000', // 44100 48000 32000 可选----音频采样率
        a_bitrate: '192k', // 正整数 必选----音频码率
        v_format: 'yuv420p', // 420p yuyv422 uyvy422 444p 可选----输出格式
        a_bitrate_custom: ''
      },
      checkedLogo: {},
      formOutput: {
        // outputName: '',
        type: '',
        protocol: '',
        url: '',
        tsinfo: '',
        para_name1: '',
        para_value1: '',
        para_name2: '',
        para_value2: '',
        para_name3: '',
        para_value3: ''
      },
      input: {},
      inputIndex: '',
      output: [],
      outputIndex: [],
      editInputIdx: '',
      editOutputIdx: '',
      customBitrate: false,
      rules: {
        name: [
          { required: true, message: '请输入频道名称', trigger: 'blur' }
        ],
        // inputName: [
        //   { required: true, message: '请输入名称', trigger: 'blur' }
        // ],
        // outputName: [
        //   { required: true, message: '请输入名称', trigger: 'blur' }
        // ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        // typename: [
        //   { required: true, message: '请输入类型名称', trigger: 'blur' }
        // ],
        protocol: [
          { required: true, message: '请选择协议', trigger: 'change' }
        ],
        url: [
          { required: true, message: '请输入链接地址', trigger: 'blur' }
        ],
        v_codec: [
          { required: true, message: '请选择视频编码', trigger: 'change' }
        ],
        v_bitrate: [
          { required: true, message: '请输入视频码率', trigger: 'blur' }
        ],
        a_codec: [
          { required: true, message: '请选择音频编码', trigger: 'change' }
        ],
        a_bitrate: [
          { required: true, message: '请输入音频码率', trigger: 'change' }
        ],
        a_bitrate_custom: [
          { required: true, message: '请输入自定义音频码率', trigger: 'blur' }
        ],
        format: [
          { required: true, message: '请输入输出格式', trigger: 'blur' }
        ]
      },
      v_codec_obj: {
        'copy': 'PASS',
        'libx265': 'HEVC',
        'hevc_nvenc': 'HEVC硬编',
        'libx264': 'H264',
        'h264_nvenc': 'H264硬编'
      },
      decoder_obj: {
        // '': 'PASS',
        'hevc': 'HEVC',
        'hevc_cuvid': 'HEVC硬解',
        'h264': 'H264',
        'h264_cuvid': 'H264硬解'
      }
    }
  },
  computed: {
    ...mapGetters({
      inputList: 'service/inputsTypeNot2',
      outputList: 'service/outputsTypeNot2'
    }),
    ...mapState({
      channel: state => state.service.channel,
      // inputList: state => state.service.inputs,
      // outputList: state => state.service.outputs,
      logoList: state => state.service.logos
    })
  },
  watch: {
    'formInput.type': function(val, oldVal) {
      var typeArr = ['设备', '网络', '文件']
      if (val) {
        this.formInput.typename = typeArr[val]
      }
    },
    'formOutput.type': function(val, oldVal) {
      var typeArr = ['设备', '网络', '文件']
      if (val) {
        this.formOutput.typename = typeArr[val]
      }
    },
    'formEncode.v_resolution': function(val, oldVal) {
      if (val) {
        if (val.indexOf('x') > 0) {
          var arr = val.split('x')
          this.formEncode.v_resolution_w = arr[0]
          this.formEncode.v_resolution_h = arr[1]
        } else {
          this.formEncode.v_resolution_w = ''
          this.formEncode.v_resolution_h = ''
        }
      } else {
        this.formEncode.v_resolution_w = ''
        this.formEncode.v_resolution_h = ''
      }
    },
    'formEncode.v_resolution_w': function(val, oldVal) {
      if (val) {
        this.v_resolution_w = String(val) || '1920'
      }
    },
    'formEncode.v_resolution_h': function(val, oldVal) {
      if (val) {
        this.v_resolution_h = String(val) || '1080'
      }
    },
    'formEncode.a_bitrate': function(val, oldVal) {
      if (val === '自定义') {
        this.customBitrate = true
      } else {
        this.customBitrate = false
      }
    }
  },
  mounted() {
    this.getOutputList()
    this.getInputList()
    this.getLogoList()
    if (this.$route.params.sid) {
      this.flag = 'edit'
      this.getChannel()
    } else {
      this.flag = 'add'
      this.formInput = {}
      this.formOutput = {}
      // this.formEncode = {}
      this.$store.commit('service/SET_CHANNEL', {})
    }
  },
  methods: {
    toggle(item) {
      if (this.channel.status === 1) return
      if (item) {
        if (this.curr !== item) {
          this.curr = item
        } else {
          this.curr = ''
        }
        this.handle = 'view'
      }
    },
    newData(item) {
      this.formInput = { type: 1, decoder: 'hevc' }
      this.formOutput = { type: 1 }
      // this.formEncode = {}
      this.curr = item
      this.handle = 'form'
    },
    onSubmitService(formName) {
      this.$refs.formService.validate((valid) => {
        if (valid) {
          if (!this.input.id) {
            this.$message.error('请选择或添加输入配置！')
            return
          }
          if (!this.output.length) {
            this.$message.error('请选择或添加输出配置！')
            return
          }
          if (this.formService.type === 0) {
            this.$refs.formEncode.validate((valid2) => {
              if (valid2) {
                if (this.flag === 'edit' && this.channel.id) {
                  this.editChannel()
                } else {
                  this.addChannel()
                }
              } else {
                this.curr = 'encode'
                this.handle = 'form'
                this.$message.error('请完善编码配置！')
              }
            })
          } else {
            if (this.flag === 'edit' && this.channel.id) {
              this.editChannel()
            } else {
              this.addChannel()
            }
          }
        } else {
          this.$message.error('请完善service设置！')
          return false
        }
      })
    },
    onSubmitInput(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formInput.id) {
            this.editInput()
          } else {
            this.addInput()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onSubmitOutput(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formOutput.id) {
            this.editOutput()
          } else {
            this.addOutput()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onSubmitEncode(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // if (!this.checkedLogo.id) {
          //   this.$message.error('请上传或选择台标！')
          // } else {
          this.handle = 'view'
          // }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addInput() {
      var params = this.formInput
      console.log(params)
      // 创建
      if (this.loading) return
      this.loading = true
      this.$store.dispatch('service/addInput', params).then((response) => {
        this.$message({
          message: '输入配置添加成功！',
          type: 'success'
        })
        this.loading = false
        this.handle = 'view'
      }).catch((e) => {
        this.$message({
          message: e.response.data || '输入配置添加失败！',
          type: 'error'
        })
        this.loading = false
      })
    },
    delInput(index, id) {
      var params = {
        id: id,
        index: index
      }
      this.$confirm('确定要删除此输入配置吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('service/delInput', params).then(() => {
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
        }).catch((e) => {
          this.$message({
            message: e.response.data || '删除失败！',
            type: 'error'
          })
        })
      }).catch(() => {
      })
    },
    handleEditInput(index, input) {
      this.editInputIdx = index
      this.formInput = input
      this.curr = 'input'
      this.handle = 'form'
    },
    editInput() {
      var params = this.formInput
      params.index = this.editInputIdx
      if (this.loading) return
      this.loading = true
      this.$store.dispatch('service/updateInput', params).then(() => {
        this.$message({
          message: '输入配置更新成功！',
          type: 'success'
        })
        this.loading = false
        this.handle = 'view'
      }).catch((e) => {
        this.$message({
          message: e.response.data || '输入配置更新失败！',
          type: 'error'
        })
        this.loading = false
      })
    },
    addOutput() {
      var params = this.formOutput
      console.log(params)
      // 创建
      if (this.loading) return
      this.loading = true
      this.$store.dispatch('service/addOutput', params).then((response) => {
        this.$message({
          message: '输出配置添加成功！',
          type: 'success'
        })
        this.loading = false
        this.handle = 'view'
      }).catch((e) => {
        this.$message({
          message: e.response.data || '输出配置添加失败！',
          type: 'error'
        })
        this.loading = false
      })
    },
    delOutput(index, id) {
      var params = {
        id: id,
        index: index
      }
      this.$confirm('确定要删除此输出配置吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('service/delOutput', params).then(() => {
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
        }).catch((e) => {
          this.$message({
            message: e.response.data || '删除失败！',
            type: 'error'
          })
        })
      }).catch(() => {
      })

      var inArrIndex = ''
      var inArr = this.output.some(function(item, idx, arr) {
        if (item.id === id) {
          inArrIndex = idx
          return true
        } else {
          return false
        }
      })
      if (inArr) {
        this.output.splice(inArrIndex, 1)
      }
    },
    handleEditOutput(index, output) {
      this.editOutputIdx = index
      this.formOutput = output
      this.curr = 'output'
      this.handle = 'form'
    },
    editOutput() {
      var params = this.formOutput
      params.index = this.editOutputIdx
      if (this.loading) return
      this.loading = true
      this.$store.dispatch('service/updateOutput', params).then(() => {
        this.$message({
          message: '输出配置更新成功！',
          type: 'success'
        })
        this.loading = false
        this.handle = 'view'
      }).catch((e) => {
        this.$message({
          message: e.response.data || '输出配置更新失败！',
          type: 'error'
        })
        this.loading = false
      })
    },
    addChannel() {
      var params = {}
      if (this.formService.type === 0) {
        params = this.formEncode
        if (this.formEncode.a_bitrate === '自定义') {
          if (this.formEncode.a_bitrate_custom === '') {
            this.$message({
              message: '请填写您的自定义音频码率！',
              type: 'error'
            })
            return false
          } else {
            params.a_bitrate = this.formEncode.a_bitrate_custom
          }
        }
      }
      params.name = this.formService.name
      params.type = this.formService.type
      params.input_class = this.input.class
      params.input_id = this.input.id
      if (this.formService.type === 1 && this.output.length > 1) {
        this.$message({
          message: '解码器只能选择一个输出配置！',
          type: 'error'
        })
        return
      }
      if (this.output.length) {
        var outputIds = this.output.map(function(item) {
          return item.id
        })
        params.output_class = this.output[0].class
        params.output_id = outputIds.join(',')
      }
      if (this.checkedLogo.id) {
        params.logo_class = this.checkedLogo.class
        params.logo_id = this.checkedLogo.id
        params.left_percent = this.$refs.logoScale.formLogo.left
        params.top_percent = this.$refs.logoScale.formLogo.top
        params.width_percent = this.$refs.logoScale.formLogo.width
        params.height_percent = this.$refs.logoScale.formLogo.height
      }
      console.log(params)
      // 创建
      if (this.loading) return
      this.loading = true
      this.$store.dispatch('service/addChannel', params).then((response) => {
        this.$message({
          message: '频道添加成功！',
          type: 'success'
        })
        this.loading = false
        this.handle = 'view'
        this.$router.push({ path: '/service/index/' + this.formService.type })
      }).catch((e) => {
        this.$message({
          message: e.response.data || '频道添加失败！',
          type: 'error'
        })
        this.loading = false
      })
    },
    editChannel() {
      var params = {}
      if (this.formService.type === 0) {
        params = this.formEncode
        if (this.formEncode.a_bitrate === '自定义') {
          if (this.formEncode.a_bitrate_custom === '') {
            this.$message({
              message: '请填写您的自定义音频码率！',
              type: 'error'
            })
            return false
          } else {
            params.a_bitrate = this.formEncode.a_bitrate_custom
          }
        }
      } else {
        // 解码器不需要编码配置中的内容
        params.id = this.formEncode.id
      }
      params.name = this.formService.name
      params.input_class = this.input.class
      params.input_id = this.input.id
      if (this.formService.type === 1 && this.output.length > 1) {
        this.$message({
          message: '解码器只能选择一个输出配置！',
          type: 'error'
        })
        return
      }
      if (this.output.length) {
        var outputIds = this.output.map(function(item) {
          return item.id
        })
        params.output_class = this.output[0].class
        params.output_id = outputIds.join(',')
      }

      if (this.checkedLogo.id) {
        params.logo_class = this.checkedLogo.class
        params.logo_id = this.checkedLogo.id
        params.left_percent = this.$refs.logoScale.formLogo.left
        params.top_percent = this.$refs.logoScale.formLogo.top
        params.width_percent = this.$refs.logoScale.formLogo.width
        params.height_percent = this.$refs.logoScale.formLogo.height
      }
      console.log(params)
      if (this.loading) return
      this.loading = true
      this.$store.dispatch('service/updateChannel', params).then(() => {
        this.$message({
          message: '频道更新成功！',
          type: 'success'
        })
        this.loading = false
        this.handle = 'view'
        this.$router.push({ path: '/service/index/' + this.formService.type })
      }).catch((e) => {
        this.$message({
          message: e.response.data || '频道更新失败！',
          type: 'error'
        })
        this.loading = false
      })
    },
    uploadLogo(logo) {
      console.log(logo)
      this.getLogoList()
      // this.checkedLogo = logo
    },
    checkLogo(params) {
      this.checkedLogo = params.logo
      this.formEncode.logo = params.logo
      this.formEncode.width_percent = 0
      this.formEncode.height_percent = 0
    },
    delLogo(params) {
      // if (params.id === this.checkedLogo.id) {
      //   this.checkedLogo = {}
      // }
      if (this.checkedLogo && this.checkedLogo.id === params.id) {
        this.$message({
          message: '此logo已被选中，请先取消选择！',
          type: 'error'
        })
        return
      }

      this.$confirm('确定要删除此logo吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('service/delLogo', params).then(() => {
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
        }).catch((e) => {
          this.$message({
            message: e.response.data || '删除失败！',
            type: 'error'
          })
        })
      }).catch(() => {
      })
    },
    getChannel() {
      this.$store.dispatch('service/getChannel', { id: this.$route.params.sid }).then((response) => {
        this.input = response.input ? response.input : {}
        this.inputIndex = this.input.id || ''
        this.output = response.output.length ? response.output : []
        if (this.output) {
          var outputIds = this.output.map(function(item) {
            return item.id
          })
          this.outputIndex = outputIds
        }
        this.formEncode = response
        var v_resolution = (this.formEncode.v_resolution_w && this.formEncode.v_resolution_h) ? (this.formEncode.v_resolution_w + 'x' + this.formEncode.v_resolution_h) : ''
        this.$set(this.formEncode, 'v_resolution', v_resolution)
        if (['384k', '192k', '128k'].indexOf(this.formEncode.a_bitrate) === -1) {
          this.formEncode.a_bitrate_custom = this.formEncode.a_bitrate
          this.formEncode.a_bitrate = '自定义'
        }
        this.formService.name = response.name
        this.formService.type = response.type
        this.checkedLogo = response.logo ? response.logo : {}
      }).catch(() => {
      })
    },
    getInputList() {
      this.$store.dispatch('service/getInputs').then(() => {
      }).catch(() => {
      })
    },
    getOutputList() {
      this.$store.dispatch('service/getOutputs').then(() => {
      }).catch(() => {
      })
    },
    getLogoList() {
      this.$store.dispatch('service/getLogos').then(() => {
      }).catch(() => {
      })
    },
    inputChange(input) {
      this.input = input
    },
    outputChange(event, output, index) {
      if (event) {
        this.output.push(output)
      } else {
        var delIdx = ''
        for (var i = 0; i < this.output.length; i++) {
          var item = this.output[i]
          if (item.id === output.id) {
            delIdx = i
          }
        }
        if (delIdx !== '') {
          this.output.splice(delIdx, 1)
        }
      }
    },
    cleanLogo() {
      this.checkedLogo = {}
      this.formEncode.logo = null
      this.formEncode.width_percent = 0
      this.formEncode.height_percent = 0
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}
.btnEdit {
  float: right;
  padding: 3px 0;
}
.cardHeader {
  cursor: pointer;
}
.cardHeader.current {
  color: #409EFF;
}
.cardHeader .el-button {
  float: right;
  padding: 3px 0;
}
.formInfo img {
  max-width: 100px;
  height: auto;
}
.formInfo p {
  margin: 7px 0;
}
.formInfo + .formInfo {
  border-top: 1px solid #666;
}

.table-expand {
  font-size: 0;
}
.table-expand label {
  width: 90px;
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-select {
  width: 100%;
}
</style>
